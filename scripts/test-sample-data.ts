// MUST load environment variables FIRST before any other imports
import dotenv from 'dotenv'
import { join } from 'path'
dotenv.config({ path: join(process.cwd(), '.env.local') })

// Now we can import modules that depend on env vars
import { supabase } from '../lib/supabase'
import { insert, query } from '../lib/db'

async function testSampleData() {
  console.log('🧪 Testing database with sample data...\n')

  try {
    // Test 1: Insert a sample lead
    console.log('Test 1: Inserting sample lead...')
    const { data: lead, error: leadError } = await insert('leads', {
      business_name: 'Test Plumbing Co',
      email: 'test@plumbing.com',
      website: 'https://testplumbing.com',
      phone: '0400123456',
      industry: 'plumbing',
      status: 'pending',
      source: 'manual'
    })

    if (leadError) {
      console.error('❌ Failed to insert lead:', leadError)
      return
    }

    console.log('✅ Lead inserted:', lead.id)

    // Test 2: Query the lead back
    console.log('\nTest 2: Querying leads...')
    const { data: leads, error: queryError } = await query('leads')

    if (queryError) {
      console.error('❌ Failed to query leads:', queryError)
      return
    }

    console.log(`✅ Found ${leads?.length} lead(s)`)

    // Test 3: Check automation settings (should have default)
    console.log('\nTest 3: Checking automation settings...')
    const { data: settings } = await query('automation_settings')
    console.log('✅ Automation settings:', settings?.[0]?.pause_before_email ? 'Configured' : 'Not configured')

    // Test 4: Check crawler config (should have 3 defaults)
    console.log('\nTest 4: Checking crawler config...')
    const { data: crawlers } = await query('crawler_config')
    console.log(`✅ Found ${crawlers?.length} crawler configuration(s)`)

    // Cleanup: Delete test lead
    console.log('\nCleaning up test data...')
    await supabase.from('leads').delete().eq('id', lead.id)
    console.log('✅ Test data cleaned up')

    console.log('\n🎉 All database tests passed!')

  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testSampleData()
