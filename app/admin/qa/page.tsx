'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AlertCircle, CheckCircle, Eye, RefreshCw, XCircle } from 'lucide-react'

interface Site {
  id: string
  qa_score: number
  qa_status: string
  qa_reviewed_at: string
  leads: {
    business_name: string
    industry: string
  }
  qa_reviews: Array<{
    review_type: string
    score: number
    passed: boolean
    issues: string[]
    recommendations: string[]
    breakdown: any
  }>
}

export default function QAQueuePage() {
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQAQueue()
  }, [])

  async function fetchQAQueue() {
    try {
      const response = await fetch('/api/admin/qa/queue')
      const data = await response.json()
      setSites(data.sites || [])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch QA queue:', error)
      setLoading(false)
    }
  }

  async function approveSite(siteId: string) {
    const confirmed = confirm('Approve this site and mark it ready for delivery?')
    if (!confirmed) return

    await fetch(`/api/admin/qa/${siteId}/approve`, { method: 'POST' })
    fetchQAQueue()
  }

  async function rejectSite(siteId: string) {
    const reason = prompt('Rejection reason (optional):')
    if (reason === null) return

    await fetch(`/api/admin/qa/${siteId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    })
    fetchQAQueue()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">QA Review Queue</h1>
          <p className="text-gray-600 mt-2">
            Sites requiring manual quality review
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchQAQueue}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {sites.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <p className="font-semibold text-gray-700">No sites pending review</p>
            <p className="text-sm text-gray-500 mt-1">All clear! No manual reviews needed.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {sites.map((site) => {
            const contentReview = site.qa_reviews?.find((r) => r.review_type === 'content')
            const visualReview = site.qa_reviews?.find((r) => r.review_type === 'visual')

            return (
              <Card key={site.id} className="border-yellow-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{site.leads?.business_name}</CardTitle>
                      <CardDescription>
                        Industry: {site.leads?.industry}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={site.qa_score >= 70 ? 'default' : 'destructive'}
                      className="text-lg px-3 py-1"
                    >
                      Score: {site.qa_score}/100
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Preview Link */}
                  <div>
                    <Link
                      href={`/preview/${site.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-2 text-blue-600 hover:underline font-semibold"
                    >
                      <Eye className="h-4 w-4" />
                      View Preview
                    </Link>
                  </div>

                  {/* QA Breakdown */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Content Review */}
                    {contentReview && (
                      <div className="bg-gray-50 p-4 rounded border">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-semibold">Content Review</span>
                          <Badge variant={contentReview.passed ? 'default' : 'destructive'}>
                            {contentReview.score}/100
                          </Badge>
                        </div>
                        {contentReview.breakdown && (
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Grammar:</span>
                              <span className="font-medium">{contentReview.breakdown.grammar}/20</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Professionalism:</span>
                              <span className="font-medium">{contentReview.breakdown.professionalism}/20</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Accuracy:</span>
                              <span className="font-medium">{contentReview.breakdown.accuracy}/20</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Completeness:</span>
                              <span className="font-medium">{contentReview.breakdown.completeness}/20</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Brand Consistency:</span>
                              <span className="font-medium">{contentReview.breakdown.brandConsistency}/20</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Visual Review */}
                    {visualReview && (
                      <div className="bg-gray-50 p-4 rounded border">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-semibold">Visual Review</span>
                          <Badge variant={visualReview.passed ? 'default' : 'destructive'}>
                            {visualReview.score}/100
                          </Badge>
                        </div>
                        {visualReview.breakdown && (
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              {visualReview.breakdown.loadsSuccessfully ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span>Loads Successfully</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {visualReview.breakdown.noVisibleErrors ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span>No Visible Errors</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {visualReview.breakdown.responsiveDesign ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span>Responsive Design</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {visualReview.breakdown.imagesLoad ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span>Images Load</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {visualReview.breakdown.ctaVisible ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span>CTA Visible</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Issues */}
                  {contentReview?.issues && contentReview.issues.length > 0 && (
                    <div className="bg-red-50 p-4 rounded border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <div className="font-semibold text-red-900">Issues Found:</div>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-800">
                        {contentReview.issues.map((issue, idx) => (
                          <li key={idx}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {contentReview?.recommendations && contentReview.recommendations.length > 0 && (
                    <div className="bg-blue-50 p-4 rounded border border-blue-200">
                      <div className="font-semibold text-blue-900 mb-2">Recommendations:</div>
                      <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                        {contentReview.recommendations.map((rec, idx) => (
                          <li key={idx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-4 pt-4 border-t">
                    <Button
                      onClick={() => approveSite(site.id)}
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve & Send
                    </Button>
                    <Button
                      onClick={() => rejectSite(site.id)}
                      variant="destructive"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject & Regenerate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">QA Review Instructions</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800 text-sm space-y-2">
          <p>
            <strong>Review Criteria:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Check that all content is professional and accurate</li>
            <li>Verify business name is used correctly throughout</li>
            <li>Ensure no spelling or grammar errors</li>
            <li>Confirm page loads properly and is mobile-responsive</li>
            <li>Check that CTA button is visible and functional</li>
          </ul>
          <p className="mt-3">
            <strong>Actions:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>Approve & Send:</strong> Mark site as approved and ready for delivery</li>
            <li><strong>Reject & Regenerate:</strong> Delete site and queue new generation</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
