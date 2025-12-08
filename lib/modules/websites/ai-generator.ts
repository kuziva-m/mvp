import Anthropic from '@anthropic-ai/sdk'
import type { GeneratedCopy, ScrapedData } from '@/types'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

interface GenerateParams {
  businessName: string
  industry: string
  services?: string[]
  location?: string
  scrapedData?: ScrapedData
}

export async function generateWebsiteCopy(
  params: GenerateParams
): Promise<GeneratedCopy> {
  const { businessName, industry, services, location, scrapedData } = params

  const prompt = `You are a professional copywriter. Write website copy for ${businessName}, a ${industry} business${location ? ` in ${location}` : ''}.

${scrapedData?.headings && scrapedData.headings.length > 0 ? `Their current website has these headings: ${scrapedData.headings.slice(0, 3).join(', ')}` : ''}

Generate the following sections:
1. Hero headline (8-12 words, compelling, benefit-focused)
2. Hero subheadline (15-25 words, explains what they do)
3. Three service descriptions (each with a title of 3-5 words and description of 40-60 words, benefit-focused)
4. About section (80-120 words, establishes credibility)
5. Call-to-action text (3-5 words, action-oriented)

Return ONLY a JSON object with this exact structure:
{
  "heroHeadline": "string",
  "heroSubheadline": "string",
  "services": [
    {"title": "string", "description": "string"},
    {"title": "string", "description": "string"},
    {"title": "string", "description": "string"}
  ],
  "about": "string",
  "cta": "string"
}

Style: Professional, trustworthy, benefit-focused. Match ${industry} industry tone.`

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    // Extract JSON from response
    let jsonText = content.text.trim()

    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '')

    const parsedContent = JSON.parse(jsonText)

    // Calculate cost
    const inputTokens = response.usage.input_tokens
    const outputTokens = response.usage.output_tokens
    const costUSD =
      (inputTokens * 0.003 + outputTokens * 0.015) / 1000

    return {
      heroHeadline: parsedContent.heroHeadline,
      heroSubheadline: parsedContent.heroSubheadline,
      services: parsedContent.services,
      about: parsedContent.about,
      cta: parsedContent.cta,
      tokensUsed: inputTokens + outputTokens,
      costUSD: parseFloat(costUSD.toFixed(4)),
    }
  } catch (error) {
    console.error('AI generation error:', error)

    // Return default copy based on industry
    return getDefaultCopy(businessName, industry)
  }
}

function getDefaultCopy(businessName: string, industry: string): GeneratedCopy {
  const defaults: Record<string, any> = {
    plumbing: {
      heroHeadline: `Professional Plumbing Services You Can Trust`,
      heroSubheadline: `${businessName} provides fast, reliable plumbing solutions for residential and commercial properties. Available 24/7 for emergencies.`,
      services: [
        {
          title: 'Emergency Repairs',
          description:
            'Fast response to plumbing emergencies including burst pipes, leaks, and blocked drains. Our experienced team is available 24/7 to help you.',
        },
        {
          title: 'Installation Services',
          description:
            'Expert installation of fixtures, water heaters, and piping systems. We use quality materials and ensure every installation meets building codes.',
        },
        {
          title: 'Maintenance Plans',
          description:
            'Regular maintenance to prevent costly repairs. Our comprehensive plans include inspections, cleaning, and early detection of potential issues.',
        },
      ],
      about: `${businessName} has been serving the community with honest, professional plumbing services. Our licensed plumbers bring years of experience and use the latest tools and techniques to solve any plumbing challenge efficiently.`,
      cta: 'Get Free Quote',
    },
    default: {
      heroHeadline: `Quality ${industry.charAt(0).toUpperCase() + industry.slice(1)} Services`,
      heroSubheadline: `${businessName} delivers exceptional service and results you can count on. We're committed to your satisfaction.`,
      services: [
        {
          title: 'Expert Service',
          description:
            'Our experienced team provides professional service with attention to detail. We take pride in delivering quality results that exceed expectations.',
        },
        {
          title: 'Reliable Solutions',
          description:
            'Count on us for dependable solutions tailored to your needs. We use proven methods and quality materials to ensure lasting results.',
        },
        {
          title: 'Customer Focus',
          description:
            'Your satisfaction is our priority. We listen to your needs, provide clear communication, and work efficiently to deliver on our promises.',
        },
      ],
      about: `${businessName} is dedicated to providing excellent service. Our team combines expertise with a commitment to customer satisfaction, ensuring you receive the quality and reliability you deserve.`,
      cta: 'Contact Us Today',
    },
  }

  const copy = defaults[industry] || defaults.default

  return {
    ...copy,
    tokensUsed: 0,
    costUSD: 0,
  }
}
