import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Get all submissions
    const { data: submissions } = await supabase
      .from('lead_magnet_submissions')
      .select('*')

    if (!submissions) {
      return NextResponse.json({
        totalSubmissions: 0,
        totalGenerated: 0,
        totalConverted: 0,
        conversionRate: 0,
        revenue: 0,
        costPerLead: 0,
        roi: 0,
        campaignBreakdown: [],
      })
    }

    // Calculate metrics
    const totalSubmissions = submissions.length
    const totalGenerated = submissions.filter(s => s.status === 'generated' || s.status === 'delivered' || s.status === 'converted').length
    const totalConverted = submissions.filter(s => s.status === 'converted').length
    const conversionRate = totalSubmissions > 0 ? (totalConverted / totalSubmissions) * 100 : 0

    // Calculate revenue (assuming $99/month)
    const revenue = totalConverted * 99

    // Get total ad spend
    const { data: campaigns } = await supabase
      .from('lead_magnet_campaigns')
      .select('ad_spend')

    const totalAdSpend = campaigns?.reduce((sum, c) => sum + parseFloat(c.ad_spend || '0'), 0) || 0
    const costPerLead = totalSubmissions > 0 ? totalAdSpend / totalSubmissions : 0
    const roi = totalAdSpend > 0 ? ((revenue - totalAdSpend) / totalAdSpend) * 100 : 0

    // Campaign breakdown
    const { data: campaignData } = await supabase
      .from('lead_magnet_campaigns')
      .select(`
        id,
        name,
        platform,
        ad_spend,
        submissions:lead_magnet_submissions(count)
      `)

    const campaignBreakdown = campaignData?.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      platform: campaign.platform,
      submissions: (campaign.submissions as any)?.length || 0,
      adSpend: parseFloat(campaign.ad_spend || '0'),
      costPerLead: (campaign.submissions as any)?.length > 0
        ? parseFloat(campaign.ad_spend || '0') / (campaign.submissions as any).length
        : 0,
    })) || []

    // Funnel metrics
    const visited = submissions.filter(s => s.landing_page_visited_at).length
    const formStarted = submissions.filter(s => s.form_started_at).length
    const formCompleted = submissions.filter(s => s.form_completed_at).length
    const generated = submissions.filter(s => s.website_generated_at).length
    const delivered = submissions.filter(s => s.email_sent_at).length
    const previewVisited = submissions.filter(s => s.preview_visited_at).length
    const ctaClicked = submissions.filter(s => s.cta_clicked_at).length

    return NextResponse.json({
      totalSubmissions,
      totalGenerated,
      totalConverted,
      conversionRate: Math.round(conversionRate * 10) / 10,
      revenue,
      costPerLead: Math.round(costPerLead * 100) / 100,
      roi: Math.round(roi * 10) / 10,
      campaignBreakdown,
      funnelMetrics: {
        visited,
        formStarted,
        formCompleted,
        generated,
        delivered,
        previewVisited,
        ctaClicked,
        converted: totalConverted,
      },
    })

  } catch (error) {
    console.error('❌ Failed to get stats:', error)
    return NextResponse.json(
      { error: 'Failed to get stats' },
      { status: 500 }
    )
  }
}
