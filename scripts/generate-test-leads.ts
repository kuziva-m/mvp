import { config } from 'dotenv'
config({ path: '.env.local' })

import { generateMockLeads } from '../lib/modules/leads/mock-data-generator'
import { addJobToQueue, leadProcessingQueue } from '../lib/queues'

async function generateLeads() {
  const count = parseInt(process.argv[2] || '100')

  console.log(`🔧 Generating ${count} mock leads...`)

  const leads = generateMockLeads({ count })

  console.log(`✅ Generated ${leads.length} leads`)
  console.log(`📤 Queuing for processing...`)

  for (const lead of leads) {
    await addJobToQueue(leadProcessingQueue, 'process', lead)
  }

  console.log(`✅ All leads queued!`)
  console.log(`👉 Start workers: npm run workers`)

  process.exit(0)
}

generateLeads()
