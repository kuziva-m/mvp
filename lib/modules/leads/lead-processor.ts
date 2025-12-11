import { supabase } from '@/lib/supabase'
import { checkDuplicate, logDuplicate } from './deduplication'
import { scoreLeadQuality } from './quality-scorer'
import { addJobToQueue, siteGenerationQueue } from '@/lib/queues'

export async function processRawLead(rawData: any) {
  try {
    // Check duplicates
    const dupeCheck = await checkDuplicate({
      business_name: rawData.business_name,
      email: rawData.email,
      phone: rawData.phone,
      website: rawData.website,
    })

    if (dupeCheck.isDuplicate) {
      await logDuplicate(
        rawData.source,
        dupeCheck.matchedOn!,
        dupeCheck.existingLeadId!,
        rawData
      )

      return {
        added: false,
        reason: `Duplicate (${dupeCheck.matchedOn})`,
        duplicate: true,
      }
    }

    // Score quality
    const quality = scoreLeadQuality({
      ...rawData,
      has_website: !!rawData.website,
      website_age: rawData.business_age ? Math.floor(rawData.business_age / 2) : null,
    })

    // Check threshold
    if (!quality.shouldAutoAdd) {
      return {
        added: false,
        reason: `Low quality (${quality.score}/100)`,
        qualityScore: quality.score,
      }
    }

    // Add to database
    const { data: lead, error } = await supabase
      .from('leads')
      .insert({
        business_name: rawData.business_name,
        email: rawData.email,
        phone: rawData.phone,
        website: rawData.website,
        industry: rawData.industry || 'unknown',
        status: 'pending',
        source: rawData.source,
        quality_score: quality.score,
        scraped_data: {
          address: rawData.address,
          city: rawData.city,
          state: rawData.state,
          postcode: rawData.postcode,
          owner_name: rawData.owner_name,
          business_age: rawData.business_age,
          rating: rawData.rating,
          reviews_count: rawData.reviews_count,
          quality_breakdown: quality.breakdown,
          source_metadata: rawData.source_metadata,
        },
      })
      .select()
      .single()

    if (error) {
      return { added: false, reason: `DB error: ${error.message}` }
    }

    // Queue website generation
    await addJobToQueue(siteGenerationQueue, 'generate', {
      leadId: lead.id,
    })

    return {
      added: true,
      leadId: lead.id,
      reason: 'Success',
      qualityScore: quality.score,
    }

  } catch (error) {
    return {
      added: false,
      reason: `Error: ${error instanceof Error ? error.message : 'Unknown'}`,
    }
  }
}
