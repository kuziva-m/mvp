import { checkAndSendFollowUps } from '../lib/modules/emails/follow-ups'

/**
 * Background worker for automated follow-up emails
 * This will be called by cron scheduling in the future
 *
 * For now, it can be triggered manually via:
 * POST /api/admin/follow-ups/run
 */
export async function runFollowUpWorker() {
  console.log('Running follow-up worker...')

  try {
    const result = await checkAndSendFollowUps()

    console.log('Follow-ups sent:', {
      day3: result.day3Sent,
      day7: result.day7Sent,
      day14: result.day14Sent,
      total: result.total,
      errors: result.errors.length,
    })

    if (result.errors.length > 0) {
      console.error('Errors during follow-up sending:')
      result.errors.forEach(error => console.error('  -', error))
    }

    return result
  } catch (error) {
    console.error('Follow-up worker error:', error)
    throw error
  }
}

// For testing: Uncomment to run directly with ts-node
// runFollowUpWorker().then(() => {
//   console.log('Worker completed')
//   process.exit(0)
// }).catch((error) => {
//   console.error('Worker failed:', error)
//   process.exit(1)
// })
