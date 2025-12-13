'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Mail, ExternalLink } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const submissionId = searchParams.get('submissionId')
  const [submission, setSubmission] = useState<any>(null)

  useEffect(() => {
    fetchSubmission()
  }, [])

  async function fetchSubmission() {
    if (!submissionId) return

    const response = await fetch(`/api/lead-magnet/submission/${submissionId}`)
    const data = await response.json()
    setSubmission(data.submission)
  }

  if (!submission) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  const previewUrl = `${window.location.origin}/preview/${submission.site_id}`

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Your Website is Ready! 🎉</h1>
          <p className="text-xl text-gray-600">
            We've sent it to <strong>{submission.email}</strong>
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <Mail className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-2">Check Your Email</h3>
                <p className="text-gray-700">
                  We've sent your website link to <strong>{submission.email}</strong>
                  <br />
                  Don't see it? Check your spam folder!
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Or view your website right now:
            </p>
            <Button
              size="lg"
              onClick={() => window.open(previewUrl, '_blank')}
              className="text-lg"
            >
              <ExternalLink className="mr-2 h-5 w-5" />
              View My Website
            </Button>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-3">What Happens Next?</h3>
            <ol className="space-y-2 text-gray-700">
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">1.</span>
                <span>Review your website and share it with friends</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">2.</span>
                <span>Love it? Publish to your own domain for $99/month</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">3.</span>
                <span>Get business email, unlimited updates, and full support</span>
              </li>
            </ol>
          </div>

          <div className="text-center pt-4">
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.open(previewUrl, '_blank')}
              className="text-lg"
            >
              View My Website Now →
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
