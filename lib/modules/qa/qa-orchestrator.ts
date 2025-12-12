import { reviewWebsiteContent, logQAReview } from './content-reviewer'
import { performVisualQA } from './visual-validator'
import { supabase } from '@/lib/supabase'

export interface QAResult {
  overallScore: number
  passed: boolean
  needsManualReview: boolean
  contentReview: any
  visualReview: any
}

export async function runCompleteQA(siteId: string): Promise<QAResult> {
  console.log(`🔍 Starting complete QA for site: ${siteId}`)

  // Get site and lead data
  const { data: site } = await supabase
    .from('sites')
    .select('*, leads(*)')
    .eq('id', siteId)
    .single()

  if (!site) {
    throw new Error('Site not found')
  }

  const lead = site.leads
  const generatedCopy = site.content_data

  // Step 1: Content Review (AI)
  const contentReview = await reviewWebsiteContent(
    lead.business_name,
    lead.industry,
    generatedCopy
  )

  await logQAReview(siteId, contentReview, 'content')

  // Step 2: Visual QA (Puppeteer)
  const previewUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/preview/${siteId}`
  const visualReview = await performVisualQA(previewUrl, siteId)

  await logQAReview(siteId, {
    score: visualReview.score,
    passed: visualReview.passed,
    issues: visualReview.passed ? [] : ['Visual validation failed'],
    recommendations: [],
    breakdown: visualReview.checks as any,
  }, 'visual')

  // Step 3: Calculate overall score (weighted average)
  const overallScore = Math.round(
    (contentReview.score * 0.7) + // Content is 70% of score
    (visualReview.score * 0.3)    // Visual is 30% of score
  )

  // Step 4: Determine outcome
  let qaStatus: string
  let passed = false
  let needsManualReview = false

  if (overallScore >= 80) {
    // High quality - auto-approve
    qaStatus = 'passed'
    passed = true
    console.log(`✅ AUTO-APPROVED: ${lead.business_name} (score: ${overallScore})`)
  } else if (overallScore >= 60) {
    // Medium quality - needs manual review
    qaStatus = 'manual_review'
    needsManualReview = true
    console.log(`⚠️ MANUAL REVIEW NEEDED: ${lead.business_name} (score: ${overallScore})`)
  } else {
    // Low quality - failed, regenerate
    qaStatus = 'failed'
    console.log(`❌ QA FAILED: ${lead.business_name} (score: ${overallScore})`)
  }

  // Step 5: Update site with QA results
  await supabase
    .from('sites')
    .update({
      qa_status: qaStatus,
      qa_score: overallScore,
      qa_reviewed_at: new Date().toISOString(),
      qa_reviewed_by: 'ai',
    })
    .eq('id', siteId)

  return {
    overallScore,
    passed,
    needsManualReview,
    contentReview,
    visualReview,
  }
}

// Regenerate failed site
export async function regenerateFailedSite(siteId: string) {
  console.log(`🔄 Regenerating failed site: ${siteId}`)

  const { data: site } = await supabase
    .from('sites')
    .select('lead_id')
    .eq('id', siteId)
    .single()

  if (!site) return

  // Delete old site
  await supabase
    .from('sites')
    .delete()
    .eq('id', siteId)

  // Queue new generation
  const { addJobToQueue, siteGenerationQueue } = await import('@/lib/queues')
  await addJobToQueue(siteGenerationQueue, 'generate', {
    leadId: site.lead_id,
    regeneration: true,
  })

  console.log(`✅ Regeneration queued for lead: ${site.lead_id}`)
}
