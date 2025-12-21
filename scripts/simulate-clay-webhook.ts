import { config } from 'dotenv'
config({ path: '.env.local' })

import { generateMockLeads } from '../lib/modules/leads/mock-data-generator'

async function simulateClayWebhook() {
  const count = parseInt(process.argv[2] || '10')

  console.log(`🧪 Simulating ${count} Clay webhook calls...`)

  const leads = generateMockLeads({ count })

  for (const lead of leads) {
    const response = await fetch('http://localhost:3000/api/webhooks/clay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    })

    const result = await response.json()
    console.log(`${result.success ? '✅' : '❌'} ${lead.business_name}`)

    await new Promise(resolve => setTimeout(resolve, 500))
  }

  console.log(`✅ Simulation complete!`)
}

simulateClayWebhook()
