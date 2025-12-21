import { NextRequest, NextResponse } from 'next/server'
import { addJobToQueue, leadProcessingQueue } from '@/lib/queues'

const IS_MOCK_MODE = !process.env.CLAY_WEBHOOK_SECRET

function verifyClaySignature(request: NextRequest): boolean {
  if (IS_MOCK_MODE) return true

  const signature = request.headers.get('x-clay-signature')
  return signature === process.env.CLAY_WEBHOOK_SECRET
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyClaySignature(request)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const data = await request.json()

    // Normalize Clay data
    const normalizedLead = {
      business_name: data.business_name || data.company_name || data.name,
      email: data.email || data.work_email || null,
      phone: data.phone || data.phone_number || null,
      website: data.website || data.company_website || null,
      address: data.address || data.full_address || null,
      city: data.city || null,
      state: data.state || data.region || null,
      postcode: data.postcode || data.zip || null,
      industry: data.industry || data.category || 'unknown',
      owner_name: data.owner_name || data.contact_name || null,
      business_age: data.business_age || null,
      rating: data.rating || null,
      reviews_count: data.reviews || data.review_count || null,
      source: IS_MOCK_MODE ? 'clay-mock' : 'clay',
      source_metadata: {
        clay_record_id: data.id || data.record_id,
        clay_workflow: data.workflow_name || 'unknown',
        scraped_at: new Date().toISOString(),
      },
    }

    if (!normalizedLead.business_name) {
      return NextResponse.json({ error: 'Missing business_name' }, { status: 400 })
    }

    await addJobToQueue(leadProcessingQueue, 'process', normalizedLead)

    console.log(`✅ ${IS_MOCK_MODE ? '[MOCK]' : ''} Clay lead queued:`, normalizedLead.business_name)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('❌ Clay webhook error:', error)
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    mode: IS_MOCK_MODE ? 'MOCK' : 'PRODUCTION',
    endpoint: 'clay-webhook'
  })
}
