// CRITICAL: Load environment variables FIRST, before any other imports
import './env-loader'

// Now import everything else
import { Worker, Job } from 'bullmq'
import Redis from 'ioredis'
import { generateWebsite } from '../lib/modules/websites/generator'
import { sendEmail } from '../lib/modules/emails/sender'
import { deliverService } from '../lib/modules/deliveries/orchestrator'
import { processRawLead } from '../lib/modules/leads/lead-processor'

// Singleton Redis connection to prevent multiple connections
let connection: Redis | null = null

function getRedisConnection(): Redis {
  if (!connection) {
    // Use REDIS_CONNECTION_STRING first to avoid conflicts with system REDIS_URL
    const redisUrl = process.env.REDIS_CONNECTION_STRING || process.env.REDIS_URL

    if (!redisUrl) {
      throw new Error('REDIS_CONNECTION_STRING or REDIS_URL is required')
    }

    // Validate it's a redis:// URL
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

    let errorCount = 0
    const MAX_ERROR_LOGS = 3

    connection.on('connect', () => {
      console.log('✅ Redis connected')
    })

    connection.on('error', (error) => {
      // Suppress noisy ECONNRESET errors
      if (error.message.includes('ECONNRESET')) {
        if (errorCount < MAX_ERROR_LOGS) {
          console.error('❌ Redis connection unstable (ECONNRESET)')
          errorCount++
          if (errorCount === MAX_ERROR_LOGS) {
            console.error('⚠️ Redis errors suppressed. Install local Redis: see INSTALL_REDIS_WINDOWS.md')
          }
        }
        return
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

// Lead Processing Worker
export const leadProcessingWorker = new Worker(
  'lead-processing',
  async (job: Job) => {
    const result = await processRawLead(job.data)

    if (result.added) {
      console.log(`✅ Added: ${job.data.business_name} (${result.qualityScore})`)
    } else {
      console.log(`⏭️ Skipped: ${job.data.business_name} (${result.reason})`)
    }

    return result
  },
  { connection: redisConnection, concurrency: 5 }
)

// Site Generation Worker
export const siteGenerationWorker = new Worker(
  'site-generation',
  async (job: Job) => {
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
    return result
  },
  { connection: redisConnection, concurrency: 3 }
)

// Email Sending Worker
export const emailSendingWorker = new Worker(
  'email-sending',
  async (job: Job) => {
    const result = await sendEmail(job.data)
    console.log(`✅ Email sent:`, result.messageId)
    return result
  },
  { connection: redisConnection, concurrency: 10 }
)

// Delivery Worker
export const deliveryWorker = new Worker(
  'delivery',
  async (job: Job) => {
    const result = await deliverService(job.data.leadId)
    console.log(`✅ Delivered:`, result.domain)
    return result
  },
  { connection: redisConnection, concurrency: 2 }
)

console.log('🚀 Queue workers started')
console.log('   Mode:', process.env.CLAY_WEBHOOK_SECRET ? 'PRODUCTION' : 'MOCK')

process.on('SIGTERM', async () => {
  console.log('Shutting down workers...')
  await Promise.all([
    leadProcessingWorker.close(),
    siteGenerationWorker.close(),
    emailSendingWorker.close(),
    deliveryWorker.close(),
  ])
  process.exit(0)
})
