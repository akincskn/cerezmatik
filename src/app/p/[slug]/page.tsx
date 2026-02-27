import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import type { Metadata } from "next"

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const site = await prisma.site.findUnique({
    where: { slug: params.slug },
    select: { companyName: true },
  })

  if (!site) {
    return { title: "Sayfa Bulunamadı — Çerezmatik" }
  }

  return {
    title: `Çerez Politikası — ${site.companyName}`,
    description: `${site.companyName} çerez politikası sayfası.`,
    robots: { index: true, follow: false },
  }
}

export default async function PublicPolicyPage({ params }: Props) {
  const site = await prisma.site.findUnique({
    where: { slug: params.slug },
    select: {
      companyName: true,
      domain: true,
      output: { select: { cookiePolicy: true } },
    },
  })

  if (!site?.output?.cookiePolicy) notFound()

  // HTML içeriğini güvenli şekilde render et
  // cookiePolicy tamamen bizim generator tarafından üretilmiş statik HTML
  return (
    <div
      dangerouslySetInnerHTML={{ __html: site.output.cookiePolicy }}
    />
  )
}
