import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { ApiResponse } from "@/types"

type RouteParams = { params: { id: string } }

// ── GET /api/sites/[id] ───────────────────────────────────────────────────

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      )
    }

    const site = await prisma.site.findFirst({
      where: { id: params.id, userId: session.user.id },
      include: { cookieConfig: true, output: true },
    })

    if (!site) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Site bulunamadı" },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse<typeof site>>({ success: true, data: site })
  } catch {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Sunucu hatası." },
      { status: 500 }
    )
  }
}

// ── DELETE /api/sites/[id] ────────────────────────────────────────────────

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Oturum açmanız gerekiyor" },
        { status: 401 }
      )
    }

    const site = await prisma.site.findFirst({
      where: { id: params.id, userId: session.user.id },
      select: { id: true },
    })

    if (!site) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Site bulunamadı" },
        { status: 404 }
      )
    }

    await prisma.site.delete({ where: { id: params.id } })

    return NextResponse.json<ApiResponse<{ id: string }>>(
      { success: true, data: { id: params.id } }
    )
  } catch {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Sunucu hatası." },
      { status: 500 }
    )
  }
}
