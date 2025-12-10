'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Clock, Globe, Mail, Server, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [countdown, setCountdown] = useState(30)

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Redirect when countdown reaches 0
    if (countdown === 0) {
      router.push('/admin')
    }
  }, [countdown, router])

  const setupSteps = [
    {
      icon: Globe,
      title: 'Domain Configuration',
      description: 'Setting up your custom domain',
      duration: '5 minutes',
    },
    {
      icon: Server,
      title: 'Website Publishing',
      description: 'Deploying your website to production',
      duration: '10 minutes',
    },
    {
      icon: Mail,
      title: 'Email Setup',
      description: 'Configuring professional email service',
      duration: '5 minutes',
    },
    {
      icon: CheckCircle,
      title: 'Welcome Email',
      description: 'Sending setup confirmation and next steps',
      duration: '1 minute',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-xl text-gray-600">Your website is being set up now</p>
          {sessionId && (
            <p className="text-sm text-gray-500 mt-2">Session ID: {sessionId}</p>
          )}
        </div>

        {/* Setup Steps */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Setup Progress</h2>
          </div>

          <div className="space-y-6">
            {setupSteps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <step.icon className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900">{step.title}</h3>
                    <span className="text-sm text-gray-500">{step.duration}</span>
                  </div>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              <strong>Expected completion:</strong> 20 minutes
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              We'll send you an email when everything is ready. You can close this page or
              head to the admin dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => router.push('/admin')}
                size="lg"
                className="w-full sm:w-auto"
              >
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open('mailto:support@example.com', '_blank')}
                size="lg"
                className="w-full sm:w-auto"
              >
                Contact Support
              </Button>
            </div>

            <p className="text-sm text-gray-500">
              Redirecting to dashboard in {countdown} seconds...
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? Email us at{' '}
            <a
              href="mailto:support@example.com"
              className="text-blue-600 hover:underline"
            >
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
