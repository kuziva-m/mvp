import { Worker, Job } from 'bullmq'
import Redis from 'ioredis'
import { runCompleteQA, regenerateFailedSite } from '../lib/modules/qa/qa-orchestrator'

const connection = new Redis(process.env.REDIS_URL || process.env.REDIS_CONNECTION_STRING || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
})

export const qaWorker = new Worker(
  'qa-review',
  async (job: Job) => {
    const { siteId } = job.data

    console.log(`🔍 Running QA for site: ${siteId}`)

    try {
      const result = await runCompleteQA(siteId)

      // If failed, automatically regenerate
      if (!result.passed && !result.needsManualReview) {
        await regenerateFailedSite(siteId)
      }

      return result
    } catch (error) {
      console.error('❌ QA processing failed:', error)
      throw error
    }
  },
  {
    connection,
    concurrency: 2, // Process 2 QA reviews simultaneously
    limiter: {
      max: 10,
      duration: 60000,
    },
  }
)

qaWorker.on('completed', (job) => {
  console.log(`✅ QA completed for site: ${job.data.siteId}`)
})

qaWorker.on('failed', (job, err) => {
  console.error(`❌ QA failed for site: ${job?.data.siteId}`, err.message)
})

console.log('🔍 QA worker started')
