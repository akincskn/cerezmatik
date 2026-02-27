"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"

export function Navbar() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-100 bg-white/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-blue-700">
          <Shield className="h-5 w-5 text-blue-600" />
          <span className="text-lg">Çerezmatik</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <Link href="/panel">
                <Button variant="ghost" size="sm" className="text-slate-600">
                  Panelim
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="border-blue-200 text-blue-700"
              >
                Çıkış
              </Button>
            </>
          ) : (
            <>
              <Link href="/giris">
                <Button variant="ghost" size="sm" className="text-slate-600">
                  Giriş
                </Button>
              </Link>
              <Link href="/olustur">
                <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                  Ücretsiz Başla
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
