// Load environment variables BEFORE any other imports
import { config } from 'dotenv'
import path from 'path'

const envPath = path.resolve(process.cwd(), '.env.local')
const result = config({ path: envPath, override: true })

if (result.error) {
  console.error('⚠️ Failed to load .env.local:', result.error.message)
  console.log('Looking for .env.local at:', envPath)
  console.log('Current working directory:', process.cwd())
  process.exit(1)
}

// Verify critical env vars are loaded
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Make sure .env.local exists with:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  console.error('  - NEXT_PUBLIC_SUPABASE_ANON_KEY')
  console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

if (!process.env.REDIS_CONNECTION_STRING && !process.env.REDIS_URL) {
  console.error('❌ Missing Redis environment variable')
  console.error('Make sure .env.local has REDIS_CONNECTION_STRING or REDIS_URL')
  process.exit(1)
}

console.log('✅ Environment variables loaded')
console.log('   SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...')
console.log('   REDIS:', (process.env.REDIS_CONNECTION_STRING || process.env.REDIS_URL)?.substring(0, 20) + '...')
