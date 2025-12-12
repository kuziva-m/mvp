// CRITICAL: Load environment variables FIRST, before any other imports
import './env-loader'

// Now import everything else
import { Worker, Job, Queue } from 'bullmq'
import Redis from 'ioredis'
import { generateWebsite } from '../lib/modules/websites/generator'
import { sendEmail } from '../lib/modules/emails/sender'
import { deliverService } from '../lib/modules/deliveries/orchestrator'
import { processRawLead } from '../lib/modules/leads/lead-processor'

// Singleton Redis connection
let connection: Redis | null = null

function getRedisConnection(): Redis {
  if (!connection) {
    const redisUrl = process.env.REDIS_CONNECTION_STRING || process.env.REDIS_URL

    if (!redisUrl) {
      throw new Error('REDIS_CONNECTION_STRING or REDIS_URL is required')
    }

    if (!redisUrl.startsWith('redis://') && !redisUrl.startsWith('rediss://')) {
      throw new Error('Redis URL must start with redis:// or rediss://')
    }

    connection = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000)
        return delay
      },
    })

    connection.on('connect', () => {
      console.log('✅ Redis connected')
    })

    connection.on('error', (error) => {
      if (error.message.includes('ECONNRESET')) {
        return // Suppress noisy errors
      }
      console.error('❌ Redis error:', error.message)
    })
  }

  return connection
}

const redisConnection = getRedisConnection()

// Cost tracking
let totalCostUSD = 0
let totalTokensUsed = 0
let sitesGenerated = 0

// Worker health tracking
interface WorkerHealth {
  healthy: boolean
  lastJob: Date
  errors: number
  jobsProcessed: number
}

const workerHealth: Record<string, WorkerHealth> = {
  leadProcessing: { healthy: true, lastJob: new Date(), errors: 0, jobsProcessed: 0 },
  siteGeneration: { healthy: true, lastJob: new Date(), errors: 0, jobsProcessed: 0 },
  emailSending: { healthy: true, lastJob: new Date(), errors: 0, jobsProcessed: 0 },
  delivery: { healthy: true, lastJob: new Date(), errors: 0, jobsProcessed: 0 },
}

// Dead Letter Queue handler
async function moveToDeadLetterQueue(queueName: string, job: Job, error: Error) {
  try {
    const { supabase } = await import('../lib/supabase')

    await supabase
      .from('dead_letter_queue')
      .insert({
        queue_name: queueName,
        job_id: job.id?.toString(),
        job_data: job.data,
        error_message: error.message,
        error_stack: error.stack,
        attempts_made: job.attemptsMade,
        failed_at: new Date().toISOString(),
      })

    console.log(`💀 [${queueName}] Job ${job.id} moved to dead letter queue`)
  } catch (err) {
    console.error('Failed to move job to dead letter queue:', err)
  }
}

// Lead Processing Worker
export const leadProcessingWorker = new Worker(
  'lead-processing',
  async (job: Job) => {
    workerHealth.leadProcessing.lastJob = new Date()

    try {
      const result = await processRawLead(job.data)

      if (result.added) {
        console.log(`✅ Added: ${job.data.business_name} (${result.qualityScore})`)
      } else {
        console.log(`⏭️ Skipped: ${job.data.business_name} (${result.reason})`)
      }

      workerHealth.leadProcessing.errors = 0
      workerHealth.leadProcessing.jobsProcessed++
      return result
    } catch (error) {
      workerHealth.leadProcessing.errors++
      console.error(`❌ Lead processing failed:`, error)
      throw error
    }
  },
  {
    connection: redisConnection,
    concurrency: 5,
    limiter: {
      max: 50, // Max 50 jobs per window
      duration: 60000, // 1 minute window
    },
  }
)

// Site Generation Worker
export const siteGenerationWorker = new Worker(
  'site-generation',
  async (job: Job) => {
    workerHealth.siteGeneration.lastJob = new Date()

    try {
      const result = await generateWebsite(job.data.leadId)

      if (result.success) {
        // Track costs
        if (result.tokensUsed && result.costUSD) {
          totalTokensUsed += result.tokensUsed
          totalCostUSD += result.costUSD
          sitesGenerated++
        }

        const costInfo = result.tokensUsed && result.costUSD
          ? ` | ${result.tokensUsed} tokens | $${result.costUSD.toFixed(4)}`
          : ''
        console.log(`✅ Site generated: ${result.siteId}${costInfo}`)
        console.log(`   💰 Total: ${sitesGenerated} sites | ${totalTokensUsed} tokens | $${totalCostUSD.toFixed(4)}`)
      } else {
        console.log(`❌ Site generation failed: ${result.error}`)
      }

      workerHealth.siteGeneration.errors = 0
      workerHealth.siteGeneration.jobsProcessed++
      return result
    } catch (error) {
      workerHealth.siteGeneration.errors++
      console.error(`❌ Site generation failed:`, error)
      throw error
    }
  },
  {
    connection: redisConnection,
    concurrency: 3,
    limiter: {
      max: 20,
      duration: 60000,
    },
  }
)

// Email Sending Worker
export const emailSendingWorker = new Worker(
  'email-sending',
  async (job: Job) => {
    workerHealth.emailSending.lastJob = new Date()

    try {
      const result = await sendEmail(job.data)
      console.log(`✅ Email sent to: ${job.data.email}`)

      workerHealth.emailSending.errors = 0
      workerHealth.emailSending.jobsProcessed++
      return result
    } catch (error) {
      workerHealth.emailSending.errors++
      console.error(`❌ Email sending failed:`, error)
      throw error
    }
  },
  {
    connection: redisConnection,
    concurrency: 10,
    limiter: {
      max: 100,
      duration: 60000,
    },
  }
)

// Delivery Worker
export const deliveryWorker = new Worker(
  'delivery',
  async (job: Job) => {
    workerHealth.delivery.lastJob = new Date()

    try {
      const result = await deliverService(job.data.leadId)
      console.log(`✅ Delivered: ${result.domain}`)

      workerHealth.delivery.errors = 0
      workerHealth.delivery.jobsProcessed++
      return result
    } catch (error) {
      workerHealth.delivery.errors++
      console.error(`❌ Delivery failed:`, error)
      throw error
    }
  },
  {
    connection: redisConnection,
    concurrency: 2,
    limiter: {
      max: 10,
      duration: 60000,
    },
  }
)

// Event listeners for all workers
const workers = [
  { worker: leadProcessingWorker, name: 'lead-processing' },
  { worker: siteGenerationWorker, name: 'site-generation' },
  { worker: emailSendingWorker, name: 'email-sending' },
  { worker: deliveryWorker, name: 'delivery' },
]

workers.forEach(({ worker, name }) => {
  worker.on('completed', (job) => {
    console.log(`✅ [${name}] Job ${job.id} completed`)
  })

  worker.on('failed', (job, err) => {
    console.error(`❌ [${name}] Job ${job?.id} failed:`, err.message)

    // Move to dead letter queue if max attempts reached
    if (job && job.attemptsMade >= 3) {
      moveToDeadLetterQueue(name, job, err)
    }
  })

  worker.on('error', (err) => {
    console.error(`❌ [${name}] Worker error:`, err)
  })
})

// Health check function
export function getWorkerHealth() {
  const now = new Date()

  Object.keys(workerHealth).forEach((key) => {
    const health = workerHealth[key]
    const timeSinceLastJob = now.getTime() - health.lastJob.getTime()

    // Mark unhealthy if no job processed in 5 minutes and errors > 5
    if (timeSinceLastJob > 5 * 60 * 1000 && health.errors > 5) {
      health.healthy = false
    } else if (health.errors < 3) {
      health.healthy = true
    }
  })

  return workerHealth
}

// Heartbeat logger
setInterval(() => {
  const health = getWorkerHealth()
  const allHealthy = Object.values(health).every(h => h.healthy)

  const totalJobs = Object.values(health).reduce((sum, h) => sum + h.jobsProcessed, 0)
  const totalErrors = Object.values(health).reduce((sum, h) => sum + h.errors, 0)

  console.log(`💓 Worker heartbeat: ${allHealthy ? '✅ ALL HEALTHY' : '⚠️ SOME UNHEALTHY'}`)
  console.log(`   📊 Jobs processed: ${totalJobs} | Errors: ${totalErrors}`)

  Object.entries(health).forEach(([name, status]) => {
    if (!status.healthy) {
      console.warn(`⚠️ ${name} is UNHEALTHY (errors: ${status.errors})`)
    }
  })
}, 30000) // Every 30 seconds

// Graceful shutdown
async function gracefulShutdown() {
  console.log('🛑 Graceful shutdown initiated...')

  // Stop accepting new jobs
  console.log('⏸️ Pausing all workers...')
  await Promise.all(workers.map(({ worker }) => worker.pause()))

  // Wait for active jobs to complete (max 30 seconds)
  console.log('⏳ Waiting for active jobs to complete (max 30s)...')
  await new Promise(resolve => setTimeout(resolve, 30000))

  // Close workers
  console.log('🔌 Closing all workers...')
  await Promise.all(workers.map(({ worker }) => worker.close()))

  // Close Redis connection
  if (connection) {
    await connection.quit()
  }

  console.log('✅ All workers closed gracefully')
  console.log(`📊 Final stats: ${sitesGenerated} sites | ${totalTokensUsed} tokens | $${totalCostUSD.toFixed(4)}`)
  process.exit(0)
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)

const instanceName = process.env.WORKER_INSTANCE || 'primary'
console.log('🚀 Worker Manager Started')
console.log(`   Instance: ${instanceName}`)
console.log(`   Mode: ${process.env.CLAY_WEBHOOK_SECRET ? 'PRODUCTION' : 'MOCK'}`)
console.log('   Workers: lead-processing, site-generation, email-sending, delivery')
console.log('   Monitoring: Health checks every 30s')
console.log('   Concurrency: Lead(5), Site(3), Email(10), Delivery(2)')
console.log('   Rate limits: Lead(50/min), Site(20/min), Email(100/min), Delivery(10/min)')
