import { testConnection } from './db'

/**
 * Test database connection
 * Run this to verify Supabase is configured correctly
 */
export async function runDatabaseTest() {
  console.log('🔍 Testing database connection...')

  const isConnected = await testConnection()

  if (isConnected) {
    console.log('✅ Database connection successful!')
    console.log('✅ Supabase client configured correctly')
    return true
  } else {
    console.error('❌ Database connection failed')
    console.error('Please check your environment variables:')
    console.error('- NEXT_PUBLIC_SUPABASE_URL')
    console.error('- SUPABASE_SERVICE_ROLE_KEY')
    return false
  }
}
