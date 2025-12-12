import { getById, insert, update } from '@/lib/db'
import type { Lead, Site, Generation } from '@/types'
import { scrapeWebsite } from './scraper'
import { generateWebsiteCopy } from './ai-generator'

interface GenerationResult {
  success: boolean
  siteId?: string
  previewUrl?: string
  tokensUsed?: number
  costUSD?: number
  error?: string
}

/**
 * Main orchestration function for website generation
 * Handles the complete workflow from lead data to generated site
 */
export async function generateWebsite(leadId: string): Promise<GenerationResult> {
  try {
    // 1. Fetch lead from database
    const { data: lead, error: leadError } = await getById<Lead>('leads', leadId)

    if (leadError || !lead) {
      return {
        success: false,
        error: 'Lead not found',
      }
    }

    // 2. Optionally scrape website if URL exists
    let scrapedData = null
    if (lead.website) {
      try {
        console.log(`Scraping website: ${lead.website}`)
        scrapedData = await scrapeWebsite(lead.website)

        if (scrapedData) {
          // Update lead with scraped data
          await update('leads', leadId, {
            scraped_data: scrapedData,
            status: 'scraped'
          })
          console.log('Website scraped successfully')
        }
      } catch (scrapeError) {
        console.error('Scraping failed, continuing without scraped data:', scrapeError)
        // Continue without scraped data - not a fatal error
      }
    }

    // 3. Determine template based on industry
    const template = getTemplateForIndustry(lead.industry)
    console.log(`Selected template: ${template} for industry: ${lead.industry}`)

    // 4. Generate website copy using AI
    console.log('Generating website copy with AI...')
    const generatedCopy = await generateWebsiteCopy({
      businessName: lead.business_name,
      industry: lead.industry,
      location: undefined,
      scrapedData: scrapedData || undefined,
    })

    // 5. Prepare content data for the site
    const contentData = {
      businessName: lead.business_name,
      industry: lead.industry,
      heroHeadline: generatedCopy.heroHeadline,
      heroSubheadline: generatedCopy.heroSubheadline,
      services: generatedCopy.services,
      about: generatedCopy.about,
      cta: generatedCopy.cta,
      colors: scrapedData?.colors ? {
        primary: scrapedData.colors.primary || undefined,
        secondary: scrapedData.colors.secondary || undefined,
        text: scrapedData.colors.text || undefined,
      } : undefined,
      logoUrl: scrapedData?.logoUrl || undefined,
    }

    // 6. Save to sites table
    const siteId = crypto.randomUUID()
    const previewUrl = `/preview/${siteId}`

    const { error: siteError } = await insert<Partial<Site>>('sites', {
      id: siteId,
      lead_id: leadId,
      framer_project_id: null,
      preview_url: previewUrl,
      published_url: null,
      custom_domain: null,
      style: template,
      is_published: false,
      content_data: contentData,
    })

    if (siteError) {
      console.error('Failed to save site:', siteError)
      return {
        success: false,
        error: 'Failed to save generated site',
      }
    }

    console.log('Site saved successfully')

    // 7. Save to generations table
    const { error: generationError } = await insert<Partial<Generation>>('generations', {
      id: crypto.randomUUID(),
      lead_id: leadId,
      site_id: siteId,
      prompt_data: {
        businessName: lead.business_name,
        industry: lead.industry,
        scrapedData: scrapedData ? {
          logoUrl: scrapedData.logoUrl,
          colors: scrapedData.colors,
          headings: scrapedData.headings,
        } : null,
      },
      ai_output: JSON.stringify(generatedCopy),
      tokens_used: generatedCopy.tokensUsed,
      cost_usd: generatedCopy.costUSD,
    })

    if (generationError) {
      console.error('Failed to save generation log:', generationError)
      // Not a fatal error - site was created successfully
    }

    // 8. Update lead status to 'generated'
    await update('leads', leadId, { status: 'generated' })
    console.log('Lead status updated to generated')

    // 9. Queue QA review
    try {
      const { Queue } = await import('bullmq')
      const { default: Redis } = await import('ioredis')

      const connection = new Redis(process.env.REDIS_URL || process.env.REDIS_CONNECTION_STRING || 'redis://localhost:6379', {
        maxRetriesPerRequest: null,
      })

      const qaQueue = new Queue('qa-review', { connection })

      await qaQueue.add('review', {
        siteId: siteId,
      })

      console.log(`✅ QA queued for site: ${siteId}`)
    } catch (qaError) {
      console.error('Failed to queue QA (non-fatal):', qaError)
      // Non-fatal - site was still created successfully
    }

    // 10. Return success result
    return {
      success: true,
      siteId,
      previewUrl,
      tokensUsed: generatedCopy.tokensUsed,
      costUSD: generatedCopy.costUSD,
    }
  } catch (error) {
    console.error('Website generation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

/**
 * Maps industry to appropriate template
 */
function getTemplateForIndustry(industry: string): string {
  const industryLower = industry.toLowerCase()

  // Service businesses
  if (
    industryLower.includes('plumb') ||
    industryLower.includes('electric') ||
    industryLower.includes('hvac') ||
    industryLower.includes('construct') ||
    industryLower.includes('repair') ||
    industryLower.includes('handyman')
  ) {
    return 'service'
  }

  // Restaurants & Food
  if (
    industryLower.includes('restaurant') ||
    industryLower.includes('cafe') ||
    industryLower.includes('coffee') ||
    industryLower.includes('food') ||
    industryLower.includes('bakery') ||
    industryLower.includes('catering')
  ) {
    return 'restaurant'
  }

  // Retail
  if (
    industryLower.includes('retail') ||
    industryLower.includes('store') ||
    industryLower.includes('shop') ||
    industryLower.includes('boutique') ||
    industryLower.includes('clothing')
  ) {
    return 'retail'
  }

  // Professional Services
  if (
    industryLower.includes('law') ||
    industryLower.includes('legal') ||
    industryLower.includes('account') ||
    industryLower.includes('consult') ||
    industryLower.includes('financial') ||
    industryLower.includes('insurance')
  ) {
    return 'professional'
  }

  // Default to modern minimal
  return 'modern'
}
