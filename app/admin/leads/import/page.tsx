'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Papa from 'papaparse'
import { toast } from 'sonner'
import { leadSchema } from '@/lib/validations/lead'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, FileText, Download, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ParsedRow {
  business_name: string
  email: string
  website?: string
  phone?: string
  industry: string
}

interface ImportResult {
  row: number
  data: ParsedRow
  success: boolean
  error?: string
}

export default function ImportLeadsPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<ImportResult[]>([])
  const [fileName, setFileName] = useState<string>('')
  const [progress, setProgress] = useState({ current: 0, total: 0 })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file')
      return
    }

    setFileName(file.name)
    processCSV(file)
  }

  const processCSV = async (file: File) => {
    setIsProcessing(true)
    setResults([])
    setProgress({ current: 0, total: 0 })

    Papa.parse<ParsedRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, '_'),
      complete: async (parseResult) => {
        const rows = parseResult.data
        setProgress({ current: 0, total: rows.length })

        const importResults: ImportResult[] = []

        // Process each row
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i]
          const rowNumber = i + 2 // +2 because: 1 for header, 1 for 0-index

          try {
            // Validate row data
            const validation = leadSchema.safeParse({
              business_name: row.business_name?.trim() || '',
              email: row.email?.trim() || '',
              website: row.website?.trim() || '',
              phone: row.phone?.trim() || '',
              industry: row.industry?.trim() || '',
            })

            if (!validation.success) {
              const errorMessages = validation.error.issues
                .map(err => `${err.path.join('.')}: ${err.message}`)
                .join(', ')

              importResults.push({
                row: rowNumber,
                data: row,
                success: false,
                error: errorMessages,
              })
              continue
            }

            // Insert into database
            const response = await fetch('/api/leads', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(validation.data),
            })

            const result = await response.json()

            if (!response.ok || !result.success) {
              importResults.push({
                row: rowNumber,
                data: row,
                success: false,
                error: result.error || 'Failed to create lead',
              })
            } else {
              importResults.push({
                row: rowNumber,
                data: row,
                success: true,
              })
            }
          } catch (error) {
            importResults.push({
              row: rowNumber,
              data: row,
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error',
            })
          }

          // Update progress
          setProgress({ current: i + 1, total: rows.length })
        }

        setResults(importResults)
        setIsProcessing(false)

        // Show summary toast
        const successCount = importResults.filter(r => r.success).length
        const failCount = importResults.filter(r => !r.success).length

        if (failCount === 0) {
          toast.success(`Successfully imported ${successCount} leads`)
        } else {
          toast.error(`${successCount} successful, ${failCount} failed`)
        }
      },
      error: (error) => {
        console.error('CSV Parse Error:', error)
        toast.error('Failed to parse CSV file. Please check the format.')
        setIsProcessing(false)
      },
    })
  }

  const downloadErrorCSV = () => {
    const errors = results.filter(r => !r.success)

    const csvContent = Papa.unparse(
      errors.map(e => ({
        row: e.row,
        business_name: e.data.business_name,
        email: e.data.email,
        website: e.data.website || '',
        phone: e.data.phone || '',
        industry: e.data.industry,
        error: e.error,
      }))
    )

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `import-errors-${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const successCount = results.filter(r => r.success).length
  const failCount = results.filter(r => !r.success).length
  const hasResults = results.length > 0

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Import Leads from CSV</h1>
        <p className="text-gray-600 mt-2">
          Upload a CSV file to import multiple leads at once
        </p>
      </div>

      {/* CSV Format Instructions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            CSV Format Requirements
          </CardTitle>
          <CardDescription>
            Your CSV file must include these columns (exact names)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-md font-mono text-sm mb-4">
            <code>business_name,email,website,phone,industry</code>
          </div>
          <div className="space-y-2 text-sm">
            <p><strong>Required columns:</strong> business_name, email, industry</p>
            <p><strong>Optional columns:</strong> website, phone</p>
            <p><strong>Industry options:</strong> plumbing, electrical, hvac, restaurant, cafe, retail, gym, lawyer, accountant, consultant, other</p>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const template = Papa.unparse([
                  {
                    business_name: "Joe's Plumbing",
                    email: "joe@plumbing.com",
                    website: "https://joesplumbing.com",
                    phone: "0400123456",
                    industry: "plumbing"
                  },
                  {
                    business_name: "Sarah's Cafe",
                    email: "sarah@cafe.com",
                    website: "",
                    phone: "0400789012",
                    industry: "cafe"
                  }
                ])
                const blob = new Blob([template], { type: 'text/csv' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'leads-template.csv'
                a.click()
                window.URL.revokeObjectURL(url)
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Template CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            {fileName ? (
              <p className="text-sm text-gray-600 mb-4">
                Selected: <strong>{fileName}</strong>
              </p>
            ) : (
              <p className="text-sm text-gray-600 mb-4">
                Click to select a CSV file
              </p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isProcessing}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Bar */}
      {isProcessing && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing rows...</span>
                <span>{progress.current} / {progress.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(progress.current / progress.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {hasResults && !isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle>Import Results</CardTitle>
            <CardDescription>
              {successCount} successful, {failCount} failed out of {results.length} total
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-900">{successCount}</p>
                  <p className="text-sm text-green-700">Imported</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                <XCircle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-900">{failCount}</p>
                  <p className="text-sm text-red-700">Failed</p>
                </div>
              </div>
            </div>

            {/* Error Details */}
            {failCount > 0 && (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {failCount} row{failCount === 1 ? '' : 's'} failed to import. Download error report below.
                  </AlertDescription>
                </Alert>

                <Button
                  variant="outline"
                  onClick={downloadErrorCSV}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Error Report
                </Button>

                <div className="max-h-64 overflow-y-auto border rounded-md">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left">Row</th>
                        <th className="px-4 py-2 text-left">Business Name</th>
                        <th className="px-4 py-2 text-left">Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results
                        .filter(r => !r.success)
                        .map((result, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="px-4 py-2">{result.row}</td>
                            <td className="px-4 py-2">{result.data.business_name || 'N/A'}</td>
                            <td className="px-4 py-2 text-red-600 text-xs">{result.error}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <Button onClick={() => router.push('/admin/leads')}>
                View All Leads
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setResults([])
                  setFileName('')
                  setProgress({ current: 0, total: 0 })
                }}
              >
                Import Another File
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
