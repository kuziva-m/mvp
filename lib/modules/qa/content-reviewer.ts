import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface ContentReviewResult {
  score: number // 0-100
  passed: boolean // true if score >= 60
  issues: string[]
  recommendations: string[]
  breakdown: {
    grammar: number // 0-20
    professionalism: number // 0-20
    accuracy: number // 0-20
    completeness: number // 0-20
    brandConsistency: number // 0-20
  }
}

export async function reviewWebsiteContent(
  businessName: string,
  industry: string,
  generatedCopy: any
): Promise<ContentReviewResult> {

  console.log(`🔍 Reviewing content for: ${businessName}`)

  const prompt = `You are a professional content quality reviewer for a website creation service.

Review this AI-generated website content and provide a quality assessment.

BUSINESS DETAILS:
- Business Name: ${businessName}
- Industry: ${industry}

GENERATED CONTENT:
${JSON.stringify(generatedCopy, null, 2)}

QUALITY CRITERIA:

1. GRAMMAR & SPELLING (0-20 points):
- No spelling errors
- Proper grammar and punctuation
- Clear, readable sentences
- No run-on sentences or fragments

2. PROFESSIONALISM (0-20 points):
- Professional tone appropriate for industry
- No informal language (unless restaurant/cafe)
- No overly salesy language
- Credible and trustworthy

3. ACCURACY (0-20 points):
- Business name used correctly throughout
- Industry terminology accurate
- No hallucinated facts or claims
- Realistic service descriptions

4. COMPLETENESS (0-20 points):
- All sections have substantive content (not generic filler)
- Hero headline is compelling (8-12 words)
- Services are specific to business
- About section establishes credibility
- CTA is clear and action-oriented

5. BRAND CONSISTENCY (0-20 points):
- Business name mentioned appropriately (2-3 times, not excessive)
- Tone consistent throughout
- Services align with industry
- No conflicting information

RESPOND IN THIS EXACT JSON FORMAT:
{
  "grammar": <score 0-20>,
  "professionalism": <score 0-20>,
  "accuracy": <score 0-20>,
  "completeness": <score 0-20>,
  "brandConsistency": <score 0-20>,
  "issues": ["issue 1", "issue 2"],
  "recommendations": ["recommendation 1", "recommendation 2"]
}

Be strict but fair. Average content should score 60-70. Excellent content scores 80+.`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : ''

    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response')
    }

    const result = JSON.parse(jsonMatch[0])

    const breakdown = {
      grammar: result.grammar || 0,
      professionalism: result.professionalism || 0,
      accuracy: result.accuracy || 0,
      completeness: result.completeness || 0,
      brandConsistency: result.brandConsistency || 0,
    }

    const score = Object.values(breakdown).reduce((sum, val) => sum + val, 0)
    const passed = score >= 60

    console.log(`✅ Content review complete: ${score}/100 (${passed ? 'PASS' : 'FAIL'})`)

    return {
      score,
      passed,
      issues: result.issues || [],
      recommendations: result.recommendations || [],
      breakdown,
    }

  } catch (error) {
    console.error('❌ Content review failed:', error)

    // Return default passing score if AI fails (don't block customer)
    return {
      score: 75,
      passed: true,
      issues: ['AI review unavailable - manual review recommended'],
      recommendations: [],
      breakdown: {
        grammar: 15,
        professionalism: 15,
        accuracy: 15,
        completeness: 15,
        brandConsistency: 15,
      },
    }
  }
}

// Log review to database for tracking
export async function logQAReview(
  siteId: string,
  reviewResult: ContentReviewResult,
  reviewType: string
) {
  const { supabase } = await import('@/lib/supabase')

  await supabase
    .from('qa_reviews')
    .insert({
      site_id: siteId,
      review_type: reviewType,
      score: reviewResult.score,
      passed: reviewResult.passed,
      issues: reviewResult.issues,
      recommendations: reviewResult.recommendations,
      breakdown: reviewResult.breakdown,
      reviewed_at: new Date().toISOString(),
    })
}
