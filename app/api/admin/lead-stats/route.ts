import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]

    const { data: todayLeads } = await supabase
      .from('leads')
      .select('id, source, quality_score')
      .gte('created_at', today)

    const { data: duplicates } = await supabase
      .from('duplicate_logs')
      .select('id', { count: 'exact' })
      .gte('logged_at', today)

    const byClay = todayLeads?.filter(l => l.source.includes('clay')).length || 0
    const byScrapeMaps = todayLeads?.filter(l => l.source.includes('scrapemaps')).length || 0
    const byMock = todayLeads?.filter(l => l.source === 'mock').length || 0

    const avgScore = todayLeads && todayLeads.length > 0
      ? todayLeads.reduce((sum, l) => sum + (l.quality_score || 0), 0) / todayLeads.length
      : 0

    return NextResponse.json({
      success: true,
      mode: process.env.CLAY_WEBHOOK_SECRET ? 'PRODUCTION' : 'MOCK',
      stats: {
        today: {
          total: todayLeads?.length || 0,
          clay: byClay,
          scrapemaps: byScrapeMaps,
          mock: byMock,
          duplicates: (duplicates as any)?.count || 0,
          avgQualityScore: Math.round(avgScore),
        },
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
