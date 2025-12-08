'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2, Wand2 } from 'lucide-react'

interface GenerateWebsiteButtonProps {
  leadId: string
}

export default function GenerateWebsiteButton({ leadId }: GenerateWebsiteButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()

  const handleGenerate = async () => {
    setIsGenerating(true)

    try {
      const response = await fetch(`/api/leads/${leadId}/generate`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed')
      }

      alert(`Website Generated Successfully!\nUsed ${data.tokensUsed} tokens ($${data.costUSD})\n\nClick OK to reload the page.`)

      // Refresh the page to show the new site
      router.refresh()
    } catch (error) {
      console.error('Generation error:', error)
      alert(`Generation Failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      size="lg"
      onClick={handleGenerate}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating Website...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Generate Website
        </>
      )}
    </Button>
  )
}
