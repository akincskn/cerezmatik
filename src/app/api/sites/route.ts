import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateSnippet } from "@/lib/snippet-generator"
import { generateCookiePolicy } from "@/lib/policy-generator"
import { generatePrivacyNotice } from "@/lib/notice-generator"
import { firmaBilgileriSchema, bannerTasarimiSchema } from "@/lib/validations"
import { z } from "zod"
import type { ApiResponse, SiteListItem } from "@/types"
import { randomBytes } from "crypto"

// ── Validation schema ─────────────────────────────────────────────────────

const selectedCookieSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.enum(["essential", "analytic", "marketing", "functional"]),
  duration: z.string(),
  required: z.boolean(),
  scriptLoader: z.string().optional(),
  trackingId: z.string().optional(),
  customName: z.string().optional(),
  customDescription: z.string().optional(),
})

const createSiteSchema = z.object({
  firmaBilgileri: firmaBilgileriSchema,
  selectedCookies: z.array(selectedCookieSchema).min(1),
  bannerTasarimi: bannerTasarimiSchema,
})

// ── POST /api/sites — Site oluştur + çıktıları üret ──────────────────────

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const body: unknown = await request.json()
    const parsed = createSiteSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: parsed.error.issues[0]?.message ?? "Geçersiz istek" },
        { status: 400 }
      )
    }

    const { firmaBilgileri, selectedCookies, bannerTasarimi } = parsed.data
    const wizardData = { firmaBilgileri, selectedCookies, bannerTasarimi }

    // Çıktıları üret
    const bannerScript = generateSnippet(wizardData)
    const cookiePolicy = generateCookiePolicy(wizardData)
    const privacyNotice = generatePrivacyNotice(wizardData)

    const slug = generateSlug(firmaBilgileri.companyName)

    const site = await prisma.site.create({
      data: {
        userId: session?.user?.id ?? null,
        slug,
        domain: firmaBilgileri.domain,
        companyName: firmaBilgileri.companyName,
        companyEmail: firmaBilgileri.email,
        mersisNo: firmaBilgileri.mersisNo || null,
        dataController: firmaBilgileri.dataController,
        cookieConfig: {
          create: {
            cookies: selectedCookies,
            bannerPosition: bannerTasarimi.position,
            bannerColor: bannerTasarimi.primaryColor,
            textColor: bannerTasarimi.textColor,
            buttonText: bannerTasarimi.buttonText,
            rejectText: bannerTasarimi.rejectText,
            detailText: bannerTasarimi.detailText,
          },
        },
        output: {
          create: { bannerScript, cookiePolicy, privacyNotice },
        },
      },
      select: {
        id: true,
        slug: true,
        output: {
          select: { bannerScript: true, cookiePolicy: true, privacyNotice: true },
        },
      },
    })

    return NextResponse.json<ApiResponse<typeof site>>(
      { success: true, data: site },
      { status: 201 }
    )
  } catch {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Sunucu hatası. Lütfen tekrar deneyin." },
      { status: 500 }
    )
  }
}

// ── GET /api/sites — Kullanıcının sitelerini listele ──────────────────────

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      )
    }

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

    const result: SiteListItem[] = sites.map((s) => ({
      id: s.id,
      slug: s.slug,
      companyName: s.companyName,
      domain: s.domain,
      createdAt: s.createdAt.toISOString(),
      hasOutput: !!s.output,
    }))

    return NextResponse.json<ApiResponse<SiteListItem[]>>({ success: true, data: result })
  } catch {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Sunucu hatası." },
      { status: 500 }
    )
  }
}

// ── Yardımcı ──────────────────────────────────────────────────────────────

function generateSlug(companyName: string): string {
  const base = companyName
    .toLowerCase()
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40)

  const suffix = randomBytes(3).toString("hex")
  return `${base}-${suffix}`
}
