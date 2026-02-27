import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Plus, Globe, Calendar, ExternalLink, Code2 } from "lucide-react"

export const metadata = {
  title: "Panelim — Çerezmatik",
}

export default async function PanelPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/giris?callbackUrl=/panel")

  const sites = await prisma.site.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      companyName: true,
      domain: true,
      createdAt: true,
      output: { select: { id: true } },
    },
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Panelim</h1>
              <p className="text-sm text-slate-500">
                Hoş geldin, {session.user.name ?? session.user.email}
              </p>
            </div>
            <Link href="/olustur">
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Yeni Oluştur
              </Button>
            </Link>
          </div>

          {sites.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Code2 className="mb-4 h-12 w-12 text-slate-300" />
                <CardTitle className="mb-2 text-slate-600">Henüz bir banner yok</CardTitle>
                <CardDescription className="mb-6">
                  İlk cookie banner&apos;ını oluşturmak için butona tıkla.
                </CardDescription>
                <Link href="/olustur">
                  <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4" />
                    İlk Banner&apos;ı Oluştur
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sites.map((site) => (
                <Card key={site.id} className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="line-clamp-1 text-base">
                        {site.companyName}
                      </CardTitle>
                      {site.output ? (
                        <Badge className="shrink-0 bg-green-100 text-green-700" variant="outline">
                          Hazır
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="shrink-0 text-slate-400">
                          Taslak
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-1 text-xs">
                      <Globe className="h-3 w-3" />
                      {site.domain}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <p className="flex items-center gap-1 text-xs text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {new Date(site.createdAt).toLocaleDateString("tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>

                    <div className="flex gap-2">
                      <Link href={`/panel/${site.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
                          <Code2 className="h-3 w-3" />
                          Görüntüle
                        </Button>
                      </Link>
                      {site.output && (
                        <Link href={`/p/${site.slug}`} target="_blank" rel="noopener">
                          <Button variant="outline" size="sm" className="gap-1 text-xs">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
