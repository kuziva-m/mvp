'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { XCircle, ArrowLeft, RefreshCw, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CancelPage() {
  const router = useRouter()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    // Try to get the preview URL from session storage or local storage
    const storedPreviewUrl = sessionStorage.getItem('previewUrl') || localStorage.getItem('lastPreviewUrl')
    if (storedPreviewUrl) {
      setPreviewUrl(storedPreviewUrl)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Cancel Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
            <XCircle className="h-10 w-10 text-gray-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Canceled</h1>
          <p className="text-xl text-gray-600">No worries! Your demo is still available</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Take Your Time
              </h2>
              <p className="text-gray-600">
                Your demo website isn't going anywhere. Feel free to review it again
                whenever you're ready.
              </p>
            </div>

            {/* Why Subscribe Section */}
            <div className="bg-blue-50 rounded-lg p-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">
                What You Get with a Subscription:
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Custom domain name (yourname.com)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Professional hosting with 99.9% uptime</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Business email (you@yourname.com)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Unlimited content updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Cancel anytime, no questions asked</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <p className="text-2xl font-bold text-gray-900 mb-1">Just $99/month</p>
              <p className="text-sm text-gray-600">Cancel anytime</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col gap-3">
            {previewUrl ? (
              <>
                <Button
                  onClick={() => router.push(previewUrl)}
                  size="lg"
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Your Demo
                </Button>
                <Button
                  onClick={() => router.push(previewUrl)}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => router.push('/admin')}
                  size="lg"
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Button>
                <Button
                  onClick={() => router.push('/admin/leads')}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  View All Leads
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              onClick={() => window.open('mailto:support@example.com', '_blank')}
              size="lg"
              className="w-full"
            >
              <Mail className="mr-2 h-4 w-4" />
              Have Questions? Contact Us
            </Button>
          </div>
        </div>

        {/* Support Info */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Still interested but have questions?
          </p>
          <p className="text-sm text-gray-600">
            Email us at{' '}
            <a
              href="mailto:support@example.com"
              className="text-blue-600 hover:underline font-medium"
            >
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
