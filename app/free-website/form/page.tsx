'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

function FormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [businessName, setBusinessName] = useState('')
  const [businessDescription, setBusinessDescription] = useState('')
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  async function handleStep1Next() {
    if (!businessName || !businessDescription) {
      alert('Please fill in all fields')
      return
    }

    await fetch('/api/lead-magnet/track-step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        step: 1,
        data: { businessName, businessDescription },
        utmParams: Object.fromEntries(searchParams.entries()),
      }),
    })

    setStep(2)
  }

  async function handleStep2Submit() {
    if (!contactName || !email) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/lead-magnet/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName,
          businessDescription,
          contactName,
          email,
          phone,
          utmParams: Object.fromEntries(searchParams.entries()),
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.push(`/free-website/generating?submissionId=${data.submissionId}`)
      } else {
        alert('Something went wrong. Please try again.')
        setLoading(false)
      }
    } catch (error) {
      alert('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const progress = step === 1 ? 50 : 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {step} of 2</span>
            <span>{progress}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {step === 1 ? "Tell Us About Your Business" : "Your Contact Information"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Business Name *
                  </label>
                  <Input
                    placeholder="e.g., Joe's Plumbing"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    What does your business do? *
                  </label>
                  <Textarea
                    placeholder="e.g., We provide emergency plumbing services and installations in Melbourne"
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                    rows={4}
                    className="text-lg"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    The more details you provide, the better your website will be!
                  </p>
                </div>

                <Button
                  onClick={handleStep1Next}
                  size="lg"
                  className="w-full text-lg"
                >
                  Next Step →
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Name *
                  </label>
                  <Input
                    placeholder="e.g., John Smith"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-lg"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    We'll send your website link to this email
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number (Optional)
                  </label>
                  <Input
                    type="tel"
                    placeholder="0400 123 456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="text-lg"
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                    disabled={loading}
                  >
                    ← Back
                  </Button>
                  <Button
                    onClick={handleStep2Submit}
                    size="lg"
                    className="flex-1 text-lg"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create My Website →'}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          🔒 Your information is secure and will never be shared
        </p>
      </div>
    </div>
  )
}

export default function FormPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <FormContent />
    </Suspense>
  )
}
