// Load environment variables
import { config } from 'dotenv'
import { join } from 'path'

// Load from project root
config({ path: join(process.cwd(), '.env.local') })

import { supabase } from '../lib/supabase'

async function verifySchema() {
  console.log('🔍 Verifying database schema...\n')

  const tables = [
    'leads',
    'sites',
    'generations',
    'email_logs',
    'email_templates',
    'subscriptions',
    'deployments',
    'automation_settings',
    'crawler_config',
    'crawler_logs',
    'support_tickets',
    'ticket_messages'
  ]

  let successCount = 0
  let failCount = 0

  for (const table of tables) {
    const { error } = await supabase.from(table).select('count').limit(1)
    
    if (error) {
      console.log(`❌ ${table}: ${error.message}`)
      failCount++
    } else {
      console.log(`✅ ${table}: exists`)
      successCount++
    }
  }

  console.log(`\n📊 Results: ${successCount} tables created, ${failCount} failed`)
  
  if (failCount === 0) {
    console.log('🎉 All tables created successfully!')
  }
}

verifySchema()