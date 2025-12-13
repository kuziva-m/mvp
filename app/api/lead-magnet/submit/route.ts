import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateWebsite } from '@/lib/modules/websites/generator'
import { sendEmail } from '@/lib/modules/emails/sender'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      businessName,
      businessDescription,
      contactName,
      email,
      phone,
      utmParams,
    } = body

    console.log(`🎯 Lead magnet submission: ${businessName}`)

    // Infer industry from description
    const industry = inferIndustry(businessDescription)

    // 1. Create lead in main system
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        business_name: businessName,
        email: email.toLowerCase().trim(),
        phone,
        industry,
        status: 'pending',
        source: 'lead_magnet',
        acquisition_source: 'lead_magnet',
        scraped_data: {
          business_description: businessDescription,
          contact_name: contactName,
        },
      })
      .select()
      .single()

    if (leadError || !lead) {
      throw new Error('Failed to create lead')
    }

    // 2. Create lead magnet submission record
    const { data: submission } = await supabase
      .from('lead_magnet_submissions')
      .insert({
        lead_id: lead.id,
        business_name: businessName,
        business_description: businessDescription,
        contact_name: contactName,
        email: email.toLowerCase().trim(),
        phone,
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
        utm_content: utmParams.utm_content,
        utm_term: utmParams.utm_term,
        form_completed_at: new Date().toISOString(),
        status: 'form_completed',
      })
      .select()
      .single()

    // 3. Generate website IMMEDIATELY
    console.log(`🔨 Generating website for: ${businessName}`)
    const siteResult = await generateWebsite(lead.id)

    if (!siteResult.success) {
      throw new Error('Failed to generate website')
    }

    // 4. Update submission with site_id
    await supabase
      .from('lead_magnet_submissions')
      .update({
        site_id: siteResult.siteId,
        website_generated_at: new Date().toISOString(),
        status: 'generated',
      })
      .eq('id', submission.id)

    // 5. Update lead with submission reference
    await supabase
      .from('leads')
      .update({
        lead_magnet_submission_id: submission.id,
      })
      .eq('id', lead.id)

    // 6. Send email with preview link
    const previewUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/preview/${siteResult.siteId}`

    await sendEmail({
      to: email,
      subject: `${businessName} - Your Website is Ready! 🎉`,
      htmlBody: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Your Website is Ready, ${contactName}! 🎉</h1>

          <p style="font-size: 18px;">
            We've created a professional website for <strong>${businessName}</strong>
            and it's ready for you to see!
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${previewUrl}"
               style="background: #2563eb; color: white; padding: 15px 40px;
                      text-decoration: none; border-radius: 8px; font-size: 18px;
                      display: inline-block;">
              View My Website →
            </a>
          </div>

          <h3>What's Included:</h3>
          <ul>
            <li>✓ Professional design tailored to your industry</li>
            <li>✓ Custom written content about your business</li>
            <li>✓ Mobile-friendly and fast loading</li>
            <li>✓ Ready to share with customers</li>
          </ul>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />

          <h3>Love Your Website?</h3>
          <p>
            Publish it to your own domain for just <strong>$99/month</strong> and get:
          </p>
          <ul>
            <li>✓ Custom domain (yourcompany.com.au)</li>
            <li>✓ Professional business email</li>
            <li>✓ Unlimited updates</li>
            <li>✓ Priority support</li>
            <li>✓ Cancel anytime</li>
          </ul>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${previewUrl}"
               style="background: #16a34a; color: white; padding: 15px 40px;
                      text-decoration: none; border-radius: 8px; font-size: 18px;
                      display: inline-block;">
              Get This Website for $99/month →
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px;">
            Questions? Just reply to this email - we're here to help!
          </p>
        </div>
      `,
      textBody: `Your website is ready! View it here: ${previewUrl}`,
      leadId: lead.id,
    })

    // 7. Update submission status
    await supabase
      .from('lead_magnet_submissions')
      .update({
        email_sent_at: new Date().toISOString(),
        status: 'delivered',
      })
      .eq('id', submission.id)

    console.log(`✅ Lead magnet complete: ${businessName}`)

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      siteId: siteResult.siteId,
    })

  } catch (error) {
    console.error('❌ Lead magnet submission failed:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create website' },
      { status: 500 }
    )
  }
}

function inferIndustry(description: string): string {
  const desc = description.toLowerCase()

  if (desc.includes('plumb')) return 'plumbing'
  if (desc.includes('electric')) return 'electrical'
  if (desc.includes('hvac') || desc.includes('heating') || desc.includes('cooling')) return 'hvac'
  if (desc.includes('roof')) return 'roofing'
  if (desc.includes('landscap') || desc.includes('garden')) return 'landscaping'
  if (desc.includes('restaurant') || desc.includes('cafe') || desc.includes('food')) return 'restaurant'
  if (desc.includes('retail') || desc.includes('store') || desc.includes('shop')) return 'retail'
  if (desc.includes('lawyer') || desc.includes('attorney') || desc.includes('legal')) return 'professional'
  if (desc.includes('accountant') || desc.includes('accounting')) return 'professional'

  return 'general'
}
