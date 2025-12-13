'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check, Zap, Shield } from 'lucide-react'

function FreeWebsiteContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    trackLandingPageVisit()
  }, [])

  async function trackLandingPageVisit() {
    const utmParams = {
      utm_source: searchParams.get('utm_source'),
      utm_medium: searchParams.get('utm_medium'),
      utm_campaign: searchParams.get('utm_campaign'),
      utm_content: searchParams.get('utm_content'),
      utm_term: searchParams.get('utm_term'),
    }

    try {
      await fetch('/api/lead-magnet/track-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(utmParams),
      })
    } catch (error) {
      console.error('Failed to track visit:', error)
    }
  }

  function handleGetStarted() {
    const params = new URLSearchParams(searchParams.toString())
    router.push(`/free-website/form?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            🎉 Limited Time Offer
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Get Your FREE Professional Website
            <span className="text-blue-600"> in 2 Minutes</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            We'll build you a complete, professional website - absolutely free.
            No credit card required. No catch.
          </p>

          <Button
            size="lg"
            onClick={handleGetStarted}
            className="text-xl px-12 py-8 mb-12"
          >
            Get My Free Website Now →
          </Button>

          <p className="text-gray-500">
            ✨ Over <strong>1,247 businesses</strong> created their website this week
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
          <Card className="p-6">
            <Zap className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Ready in 2 Minutes</h3>
            <p className="text-gray-600">
              Answer 2 quick questions and your professional website is ready instantly.
            </p>
          </Card>

          <Card className="p-6">
            <Check className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Everything Included</h3>
            <p className="text-gray-600">
              Professional design, custom content, mobile-friendly, and business email.
            </p>
          </Card>

          <Card className="p-6">
            <Shield className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">No Risk, No Commitment</h3>
            <p className="text-gray-600">
              100% free forever. Upgrade to publish for only $99/month when ready.
            </p>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            What You'll Get
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Professional Website Design',
              'AI-Generated Custom Content',
              'Mobile & Tablet Optimized',
              'Fast Loading & Secure',
              'Business Email Address',
              'Easy to Share Link',
              'Unlimited Updates',
              'Cancel Anytime',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-20">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Get Your Free Website?
          </h2>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="text-xl px-12 py-8"
          >
            Get Started - It's FREE →
          </Button>
          <p className="text-gray-500 mt-4">
            No credit card required • Takes less than 2 minutes
          </p>
        </div>
      </div>
    </div>
  )
}

export default function FreeWebsitePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <FreeWebsiteContent />
    </Suspense>
  )
}
