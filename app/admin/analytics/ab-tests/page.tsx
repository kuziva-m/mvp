'use client'

import { useEffect, useState } from 'react'
import { Loader2, Plus, TrendingUp, Trophy, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ABTest {
  id: string
  name: string
  test_type: 'subject_line' | 'email_body' | 'template'
  variant_a: string
  variant_b: string
  sample_size: number
  status: 'running' | 'completed' | 'paused'
  winner: 'a' | 'b' | 'none' | null
  created_at: string
  completed_at: string | null
}

interface TestResults {
  variantA: {
    total: number
    opened: number
    clicked: number
    subscribed: number
    openRate: number
    clickRate: number
    conversionRate: number
  }
  variantB: {
    total: number
    opened: number
    clicked: number
    subscribed: number
    openRate: number
    clickRate: number
    conversionRate: number
  }
  metricName: string
  metricA: number
  metricB: number
  isSignificant: boolean
  suggestedWinner: 'a' | 'b' | 'none' | null
}

export default function ABTestsPage() {
  const [loading, setLoading] = useState(true)
  const [tests, setTests] = useState<ABTest[]>([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null)
  const [testResults, setTestResults] = useState<TestResults | null>(null)
  const [loadingResults, setLoadingResults] = useState(false)

  // Create form state
  const [formData, setFormData] = useState({
    name: '',
    test_type: 'subject_line',
    variant_a: '',
    variant_b: '',
    sample_size: 50,
  })

  useEffect(() => {
    fetchTests()
  }, [])

  const fetchTests = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/ab-tests')
      const data = await response.json()

      if (data.success) {
        setTests(data.tests || [])
      }
    } catch (error) {
      console.error('Error fetching tests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTest = async () => {
    try {
      const response = await fetch('/api/admin/ab-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to create test')

      setIsCreateOpen(false)
      setFormData({
        name: '',
        test_type: 'subject_line',
        variant_a: '',
        variant_b: '',
        sample_size: 50,
      })
      await fetchTests()
    } catch (error) {
      console.error('Error creating test:', error)
      alert('Failed to create test')
    }
  }

  const fetchTestResults = async (testId: string) => {
    try {
      setLoadingResults(true)
      const response = await fetch(`/api/admin/ab-tests/${testId}/results`)
      const data = await response.json()

      if (data.success) {
        setTestResults(data.results)
      }
    } catch (error) {
      console.error('Error fetching results:', error)
    } finally {
      setLoadingResults(false)
    }
  }

  const handleViewResults = (test: ABTest) => {
    setSelectedTest(test)
    fetchTestResults(test.id)
  }

  const handleDeclareWinner = async (winner: 'a' | 'b' | 'none') => {
    if (!selectedTest) return

    try {
      const response = await fetch(`/api/admin/ab-tests/${selectedTest.id}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winner }),
      })

      if (!response.ok) throw new Error('Failed to declare winner')

      setSelectedTest(null)
      setTestResults(null)
      await fetchTests()
    } catch (error) {
      console.error('Error declaring winner:', error)
      alert('Failed to declare winner')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">A/B Testing</h1>
          <p className="text-gray-600 mt-1">Test and optimize your marketing campaigns</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Test
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create A/B Test</DialogTitle>
              <DialogDescription>
                Set up a new test to compare two variants
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Test Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Subject Line Test #1"
                />
              </div>

              <div>
                <Label htmlFor="test_type">Test Type</Label>
                <Select
                  value={formData.test_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, test_type: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="subject_line">Email Subject Line</SelectItem>
                    <SelectItem value="email_body">Email Body</SelectItem>
                    <SelectItem value="template">Website Template</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="variant_a">Variant A (Control)</Label>
                <Textarea
                  id="variant_a"
                  value={formData.variant_a}
                  onChange={(e) => setFormData({ ...formData, variant_a: e.target.value })}
                  placeholder="Enter variant A content..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="variant_b">Variant B (Test)</Label>
                <Textarea
                  id="variant_b"
                  value={formData.variant_b}
                  onChange={(e) => setFormData({ ...formData, variant_b: e.target.value })}
                  placeholder="Enter variant B content..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="sample_size">Sample Size (%)</Label>
                <Input
                  id="sample_size"
                  type="number"
                  min={1}
                  max={100}
                  value={formData.sample_size}
                  onChange={(e) =>
                    setFormData({ ...formData, sample_size: parseInt(e.target.value) })
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Percentage of leads to include in test
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTest}>Create Test</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Tests */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Active Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests
            .filter((t) => t.status === 'running')
            .map((test) => (
              <Card key={test.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{test.name}</CardTitle>
                    <Badge className="bg-blue-100 text-blue-800">
                      <Circle className="h-2 w-2 mr-1 fill-current" />
                      Running
                    </Badge>
                  </div>
                  <CardDescription>
                    {test.test_type.replace('_', ' ')} • {test.sample_size}% sample
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">Variant A:</p>
                      <p className="font-medium truncate">{test.variant_a}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Variant B:</p>
                      <p className="font-medium truncate">{test.variant_b}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => handleViewResults(test)}
                    >
                      View Results
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

          {tests.filter((t) => t.status === 'running').length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No active tests. Create one to get started!
            </div>
          )}
        </div>
      </div>

      {/* Completed Tests */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Completed Tests</h2>
        <div className="space-y-4">
          {tests
            .filter((t) => t.status === 'completed')
            .map((test) => (
              <Card key={test.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{test.name}</CardTitle>
                      <CardDescription>
                        Completed on {new Date(test.completed_at!).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {test.winner && test.winner !== 'none' && (
                        <Badge className="bg-green-100 text-green-800">
                          <Trophy className="h-3 w-3 mr-1" />
                          Winner: Variant {test.winner.toUpperCase()}
                        </Badge>
                      )}
                      {test.winner === 'none' && (
                        <Badge className="bg-gray-100 text-gray-800">No Clear Winner</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Variant A:</p>
                      <p className="font-medium">{test.variant_a}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Variant B:</p>
                      <p className="font-medium">{test.variant_b}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

          {tests.filter((t) => t.status === 'completed').length === 0 && (
            <div className="text-center py-8 text-gray-500">No completed tests yet</div>
          )}
        </div>
      </div>

      {/* Results Dialog */}
      {selectedTest && (
        <Dialog open={!!selectedTest} onOpenChange={() => setSelectedTest(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedTest.name} - Results</DialogTitle>
              <DialogDescription>
                Comparing {selectedTest.test_type.replace('_', ' ')} performance
              </DialogDescription>
            </DialogHeader>

            {loadingResults ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : testResults ? (
              <div className="space-y-6">
                {/* Statistical Significance */}
                {testResults.isSignificant ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-900 font-medium">
                      ✓ Results are statistically significant
                    </p>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-900 font-medium">
                      ⚠ Need more data for statistical significance (30+ samples per variant)
                    </p>
                  </div>
                )}

                {/* Comparison */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className={testResults.suggestedWinner === 'a' ? 'border-green-500' : ''}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Variant A
                        {testResults.suggestedWinner === 'a' && (
                          <Trophy className="h-5 w-5 text-green-600" />
                        )}
                      </CardTitle>
                      <CardDescription>{selectedTest.variant_a}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {testResults.metricA.toFixed(1)}%
                          </p>
                          <p className="text-sm text-gray-600">{testResults.metricName}</p>
                        </div>
                        <div className="text-sm space-y-1">
                          <p>Total: {testResults.variantA.total}</p>
                          <p>Opened: {testResults.variantA.opened}</p>
                          <p>Clicked: {testResults.variantA.clicked}</p>
                          <p>Subscribed: {testResults.variantA.subscribed}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className={testResults.suggestedWinner === 'b' ? 'border-green-500' : ''}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        Variant B
                        {testResults.suggestedWinner === 'b' && (
                          <Trophy className="h-5 w-5 text-green-600" />
                        )}
                      </CardTitle>
                      <CardDescription>{selectedTest.variant_b}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            {testResults.metricB.toFixed(1)}%
                          </p>
                          <p className="text-sm text-gray-600">{testResults.metricName}</p>
                        </div>
                        <div className="text-sm space-y-1">
                          <p>Total: {testResults.variantB.total}</p>
                          <p>Opened: {testResults.variantB.opened}</p>
                          <p>Clicked: {testResults.variantB.clicked}</p>
                          <p>Subscribed: {testResults.variantB.subscribed}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Declare Winner */}
                {selectedTest.status === 'running' && testResults.isSignificant && (
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => handleDeclareWinner('a')}
                    >
                      Declare A Winner
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDeclareWinner('b')}
                    >
                      Declare B Winner
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDeclareWinner('none')}
                    >
                      No Clear Winner
                    </Button>
                  </div>
                )}
              </div>
            ) : null}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
