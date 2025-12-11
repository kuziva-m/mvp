'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Rocket, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'

interface DeliverButtonProps {
  leadId: string
  leadName: string
  hasActiveSubscription: boolean
}

interface DeliveryStep {
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  message?: string
  duration?: number
}

export default function DeliverButton({
  leadId,
  leadName,
  hasActiveSubscription,
}: DeliverButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isDelivering, setIsDelivering] = useState(false)
  const [deliveryResult, setDeliveryResult] = useState<any>(null)
  const [steps, setSteps] = useState<DeliveryStep[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleDeliver = async () => {
    setIsDelivering(true)
    setError(null)
    setDeliveryResult(null)
    setSteps([])

    try {
      const response = await fetch(`/api/admin/deliver/${leadId}`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Delivery failed')
      }

      setDeliveryResult(data)
      setSteps(data.steps || [])

      // Refresh the page to show updated data
      setTimeout(() => {
        router.refresh()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsDelivering(false)
    }
  }

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
    }
  }

  const completedSteps = steps.filter(s => s.status === 'completed').length
  const totalSteps = steps.length
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          disabled={!hasActiveSubscription}
          className="gap-2"
        >
          <Rocket className="h-4 w-4" />
          Deliver Service
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Deliver Service to {leadName}</DialogTitle>
          <DialogDescription>
            This will register a domain, configure DNS, publish the website, and set up email.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!isDelivering && !deliveryResult && !error && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">What will happen:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ Register domain (MOCKED)</li>
                  <li>✓ Configure DNS in Cloudflare (REAL API)</li>
                  <li>✓ Publish website to Vercel (MOCKED)</li>
                  <li>✓ Create email account (MOCKED)</li>
                  <li>✓ Send welcome email with credentials</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Some services are mocked for development.
                  Check console logs for [MOCK] vs [REAL] indicators.
                </p>
              </div>

              <Button
                onClick={handleDeliver}
                className="w-full"
                size="lg"
              >
                <Rocket className="h-5 w-5 mr-2" />
                Start Delivery
              </Button>
            </div>
          )}

          {isDelivering && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{completedSteps} / {totalSteps} steps</span>
                </div>
                <Progress value={progress} />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="mt-0.5">{getStepIcon(step.status)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">
                        {step.name}
                      </div>
                      {step.message && (
                        <div className="text-xs text-red-600 mt-1">
                          {step.message}
                        </div>
                      )}
                      {step.duration && step.status === 'completed' && (
                        <div className="text-xs text-gray-500 mt-1">
                          {step.duration}ms
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {deliveryResult && !error && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Service Delivered Successfully!
                </h3>
              </div>

              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">Delivery Details:</h4>
                  <div className="space-y-2 text-sm text-green-800">
                    <div>
                      <strong>Domain:</strong>{' '}
                      <a
                        href={deliveryResult.deploymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        {deliveryResult.domain}
                      </a>
                    </div>
                    <div>
                      <strong>Email:</strong> {deliveryResult.emailAccount}
                    </div>
                    <div>
                      <strong>cPanel:</strong>{' '}
                      <a
                        href={deliveryResult.cpanelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        {deliveryResult.cpanelUrl}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    ✓ Welcome email sent to customer with all credentials and login details.
                  </p>
                </div>
              </div>

              <Button
                onClick={() => {
                  setIsOpen(false)
                  router.refresh()
                }}
                className="w-full"
              >
                Close
              </Button>
            </div>
          )}

          {error && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delivery Failed
                </h3>
                <p className="text-sm text-red-600">{error}</p>
              </div>

              {steps.length > 0 && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  <h4 className="text-sm font-medium text-gray-700">Execution Log:</h4>
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="mt-0.5">{getStepIcon(step.status)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">
                          {step.name}
                        </div>
                        {step.message && (
                          <div className="text-xs text-red-600 mt-1">
                            {step.message}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button
                onClick={() => {
                  setIsOpen(false)
                  setError(null)
                  setSteps([])
                }}
                variant="outline"
                className="w-full"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
