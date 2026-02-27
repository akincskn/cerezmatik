import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validations"
import type { ApiResponse } from "@/types"

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: parsed.error.issues[0]?.message ?? "Geçersiz istek" },
        { status: 400 }
      )
    }

    const { name, email, password } = parsed.data
    const normalizedEmail = email.toLowerCase().trim()

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    })

    if (existing) {
      return NextResponse.json<ApiResponse<never>>(
        { success: false, error: "Bu e-posta adresi zaten kayıtlı" },
        { status: 409 }
      )
    }

    const hashedPassword = await hash(password, 12)

    const user = await prisma.user.create({
      data: { name, email: normalizedEmail, password: hashedPassword },
      select: { id: true, email: true, name: true },
    })

    return NextResponse.json<ApiResponse<{ id: string; email: string; name: string | null }>>(
      { success: true, data: user },
      { status: 201 }
    )
  } catch {
    return NextResponse.json<ApiResponse<never>>(
      { success: false, error: "Sunucu hatası. Lütfen tekrar deneyin." },
      { status: 500 }
    )
  }
}
