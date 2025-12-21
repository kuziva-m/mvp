'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Loader2, Check } from 'lucide-react'

function GeneratingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const submissionId = searchParams.get('submissionId')

  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { label: 'Analyzing your business...', duration: 3000 },
    { label: 'Selecting perfect design...', duration: 2000 },
    { label: 'Writing custom content...', duration: 5000 },
    { label: 'Creating your pages...', duration: 3000 },
    { label: 'Finalizing your website...', duration: 2000 },
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout

    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 300)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const stepIndex = Math.floor((progress / 100) * steps.length)
    setCurrentStep(Math.min(stepIndex, steps.length - 1))
  }, [progress])

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        router.push(`/free-website/success?submissionId=${submissionId}`)
      }, 1000)
    }
  }, [progress, submissionId, router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <Loader2 className="h-16 w-16 text-blue-600 animate-spin mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Creating Your Website...</h1>
          <p className="text-gray-600">
            This will only take a moment. Don't close this page!
          </p>
        </div>

        <Progress value={progress} className="h-3 mb-8" />

        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 transition-opacity ${
                index <= currentStep ? 'opacity-100' : 'opacity-30'
              }`}
            >
              {index < currentStep ? (
                <Check className="h-6 w-6 text-green-600 flex-shrink-0" />
              ) : index === currentStep ? (
                <Loader2 className="h-6 w-6 text-blue-600 animate-spin flex-shrink-0" />
              ) : (
                <div className="h-6 w-6 border-2 border-gray-300 rounded-full flex-shrink-0" />
              )}
              <span className="text-lg">{step.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          💡 While you wait: Your website will be mobile-friendly,
          include business email, and be ready to share instantly!
        </div>
      </Card>
    </div>
  )
}

export default function GeneratingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <GeneratingContent />
    </Suspense>
  )
}
