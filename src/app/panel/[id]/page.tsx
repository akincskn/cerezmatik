import { getServerSession } from "next-auth"
import { redirect, notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteDetailActions } from "./SiteDetailActions"
import { DeleteSiteButton } from "./DeleteSiteButton"
import { ArrowLeft, Globe, Mail, Code2, FileText, Shield, ExternalLink } from "lucide-react"

export const metadata = {
  title: "Site Detayı — Çerezmatik",
}

interface Props {
  params: { id: string }
}

export default async function PanelDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/giris")

  const site = await prisma.site.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: { cookieConfig: true, output: true },
  })

  if (!site) notFound()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <Link
            href="/panel"
            className="mb-6 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Panele Dön
          </Link>

          {/* Header */}
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{site.companyName}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" />
                  {site.domain}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {site.companyEmail}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {site.output && (
                <Link href={`/p/${site.slug}`} target="_blank" rel="noopener">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Politika Sayfası
                  </Button>
                </Link>
              )}
              <Badge
                className={site.output ? "bg-green-100 text-green-700" : "text-slate-400"}
                variant="outline"
              >
                {site.output ? "Çıktılar Hazır" : "Taslak"}
              </Badge>
              <DeleteSiteButton siteId={site.id} companyName={site.companyName} />
            </div>
          </div>

          {/* Outputs */}
          {site.output ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <Tabs defaultValue="snippet">
                <TabsList className="mb-4 w-full">
                  <TabsTrigger value="snippet" className="flex-1 gap-2">
                    <Code2 className="h-4 w-4" />
                    JS Snippet
                  </TabsTrigger>
                  <TabsTrigger value="policy" className="flex-1 gap-2">
                    <FileText className="h-4 w-4" />
                    Çerez Politikası
                  </TabsTrigger>
                  <TabsTrigger value="notice" className="flex-1 gap-2">
                    <Shield className="h-4 w-4" />
                    Aydınlatma
                  </TabsTrigger>
                </TabsList>

                {[
                  { key: "snippet", content: site.output.bannerScript, hint: "<head> veya <body> kapanış etiketinin önüne yapıştırın." },
                  { key: "policy", content: site.output.cookiePolicy, hint: "Çerez politikası sayfanıza yapıştırın." },
                  { key: "notice", content: site.output.privacyNotice, hint: "KVKK aydınlatma metni sayfanıza yapıştırın." },
                ].map((tab) => (
                  <TabsContent key={tab.key} value={tab.key} className="space-y-3">
                    <p className="text-xs text-slate-500">{tab.hint}</p>
                    <SiteDetailActions content={tab.content} tabKey={tab.key} />
                    <pre className="max-h-80 overflow-auto rounded-lg border border-slate-200 bg-slate-950 p-4 text-xs leading-relaxed text-slate-300">
                      <code>{tab.content}</code>
                    </pre>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-slate-500">Bu site için henüz çıktı oluşturulmamış.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
