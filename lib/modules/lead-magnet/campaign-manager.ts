import { supabase } from '@/lib/supabase'

export interface Campaign {
  id: string
  name: string
  slug: string
  platform: string
  targetAudience: string
  adSpend: number
  isActive: boolean
}

export async function createCampaign(data: {
  name: string
  slug: string
  platform: string
  targetAudience: string
}) {
  const { data: campaign, error } = await supabase
    .from('lead_magnet_campaigns')
    .insert({
      name: data.name,
      slug: data.slug,
      platform: data.platform,
      target_audience: data.targetAudience,
    })
    .select()
    .single()

  if (error) throw error
  return campaign
}

export async function getCampaignBySlug(slug: string) {
  const { data, error } = await supabase
    .from('lead_magnet_campaigns')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  return data
}

// Seed default campaigns
export async function seedCampaigns() {
  const campaigns = [
    {
      name: 'Facebook - Plumbers Melbourne',
      slug: 'fb-plumbers-melb',
      platform: 'facebook',
      target_audience: 'Plumbers in Melbourne',
    },
    {
      name: 'Facebook - Restaurants Sydney',
      slug: 'fb-restaurants-syd',
      platform: 'facebook',
      target_audience: 'Restaurants in Sydney',
    },
    {
      name: 'Google Ads - Service Businesses',
      slug: 'google-services',
      platform: 'google',
      target_audience: 'Service businesses (plumbing, electrical, HVAC)',
    },
  ]

  for (const campaign of campaigns) {
    await supabase
      .from('lead_magnet_campaigns')
      .upsert(campaign, { onConflict: 'slug' })
  }

  console.log('✅ Campaigns seeded')
}
