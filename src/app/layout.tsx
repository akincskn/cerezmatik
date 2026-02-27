import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { SessionProvider } from "@/components/SessionProvider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Çerezmatik — 3 Dakikada KVKK Uyumlu Cookie Banner",
  description:
    "Türkiye'deki küçük işletmeler için ücretsiz KVKK uyumlu cookie banner, çerez politikası ve aydınlatma metni oluşturucu.",
  keywords: ["KVKK", "cookie banner", "çerez politikası", "aydınlatma metni"],
  authors: [{ name: "Çerezmatik" }],
  openGraph: {
    title: "Çerezmatik — 3 Dakikada KVKK Uyumlu Cookie Banner",
    description: "Ücretsiz KVKK uyumlu cookie banner oluşturucu. Hesap gerekmez.",
    type: "website",
    locale: "tr_TR",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="tr">
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}
