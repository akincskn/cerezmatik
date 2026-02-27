"use client"

import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useWizardStore } from "@/store/wizard"
import { generateSnippet } from "@/lib/snippet-generator"
import { generateCookiePolicy } from "@/lib/policy-generator"
import { generatePrivacyNotice } from "@/lib/notice-generator"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  Code2,
  FileText,
  Shield,
  Copy,
  Check,
  ArrowLeft,
  Save,
  RefreshCw,
} from "lucide-react"
import type { GeneratedOutputs } from "@/types"

export function Step4Ciktilar() {
  const { firmaBilgileri, selectedCookies, bannerTasarimi, prevStep, reset } = useWizardStore()
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [outputs, setOutputs] = useState<GeneratedOutputs | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedSlug, setSavedSlug] = useState<string | null>(null)

  const generateOutputs = useCallback(() => {
    const wizardData = { firmaBilgileri, selectedCookies, bannerTasarimi }
    setOutputs({
      bannerScript: generateSnippet(wizardData),
      cookiePolicy: generateCookiePolicy(wizardData),
      privacyNotice: generatePrivacyNotice(wizardData),
    })
  }, [firmaBilgileri, selectedCookies, bannerTasarimi])

  useEffect(() => {
    generateOutputs()
  }, [generateOutputs])

  async function copyToClipboard(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      toast({ title: "Kopyalandı!", description: "Metin panoya kopyalandı." })
      setTimeout(() => setCopiedKey(null), 2000)
    } catch {
      toast({ title: "Hata", description: "Kopyalama başarısız.", variant: "destructive" })
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firmaBilgileri, selectedCookies, bannerTasarimi }),
      })
      const json = await res.json()

      if (!json.success) {
        toast({ title: "Hata", description: json.error, variant: "destructive" })
        return
      }

      setSavedSlug(json.data.slug)
      toast({
        title: "Kaydedildi!",
        description: session
          ? "Panelinden yönetebilirsin."
          : "Hesap oluşturarak kaydedilen çıktılara erişebilirsin.",
      })

      if (session) {
        router.push("/panel")
      }
    } catch {
      toast({ title: "Hata", description: "Kaydedilemedi.", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  if (!outputs) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
        <span className="ml-2 text-slate-500">Çıktılar oluşturuluyor…</span>
      </div>
    )
  }

  const TABS = [
    {
      key: "snippet",
      label: "JS Snippet",
      icon: Code2,
      content: outputs.bannerScript,
      hint: "Bu kodu sitenizin <head> veya <body> kapanış etiketinin önüne yapıştırın.",
      language: "html",
    },
    {
      key: "policy",
      label: "Çerez Politikası",
      icon: FileText,
      content: outputs.cookiePolicy,
      hint: "Bu HTML'i bir sayfaya yapıştırın veya sunucunuza yükleyin.",
      language: "html",
    },
    {
      key: "notice",
      label: "Aydınlatma Metni",
      icon: Shield,
      content: outputs.privacyNotice,
      hint: "Bu HTML'i KVKK aydınlatma metni sayfanıza yapıştırın.",
      language: "html",
    },
  ]

  return (
    <div className="space-y-4">
      {/* Başarı mesajı */}
      <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
        <p className="text-sm font-medium text-green-800">
          🎉 Çıktılarınız hazır! Aşağıdaki sekmeleri kopyalayıp sitenize ekleyin.
        </p>
        {savedSlug && (
          <p className="mt-1 text-xs text-green-700">
            Çerez politikası sayfası:{" "}
            <a
              href={`/p/${savedSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              cerezmatik.com/p/{savedSlug}
            </a>
          </p>
        )}
      </div>

      <Tabs defaultValue="snippet">
        <TabsList className="w-full">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key} className="flex-1 gap-1.5 text-xs sm:text-sm">
              <tab.icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((tab) => (
          <TabsContent key={tab.key} value={tab.key} className="space-y-2 pt-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs text-slate-500">{tab.hint}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(tab.content, tab.key)}
                className="shrink-0 gap-1.5"
              >
                {copiedKey === tab.key ? (
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

            <pre className="max-h-80 overflow-auto rounded-lg border border-slate-200 bg-slate-950 p-4 text-xs leading-relaxed text-slate-300">
              <code>{tab.content}</code>
            </pre>
          </TabsContent>
        ))}
      </Tabs>

      {/* Aksiyon butonları */}
      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <Button type="button" variant="outline" onClick={prevStep} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Geri
        </Button>

        {!savedSlug && (
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
          >
            {saving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Kaydediliyor…" : session ? "Panele Kaydet" : "Kaydet & Paylaş"}
          </Button>
        )}

        <Button
          variant="outline"
          onClick={() => {
            reset()
            router.push("/olustur")
          }}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Yeni Oluştur
        </Button>
      </div>

      {!session && !savedSlug && (
        <p className="text-center text-xs text-slate-400">
          Kaydederek bir çerez politikası URL&apos;si alabilir ve oluşturduğunuzu düzenleyebilirsiniz.
          Hesap gerekmez.
        </p>
      )}
    </div>
  )
}
