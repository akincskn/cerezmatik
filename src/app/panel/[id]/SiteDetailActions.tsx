"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Copy, Check } from "lucide-react"

interface Props {
  content: string
  tabKey: string
}

export function SiteDetailActions({ content, tabKey }: Props) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      toast({ title: "Kopyalandı!", description: "Metin panoya kopyalandı." })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({ title: "Hata", description: "Kopyalama başarısız.", variant: "destructive" })
    }
  }

  return (
    <div className="flex justify-end">
      <Button
        size="sm"
        variant="outline"
        onClick={handleCopy}
        className="gap-2"
        key={tabKey}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-green-500" />
            Kopyalandı
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            Kopyala
          </>
        )}
      </Button>
    </div>
  )
}
