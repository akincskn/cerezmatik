import Link from "next/link"
import { Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          {/* Brand */}
          <div className="flex items-center gap-2 text-slate-700">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="font-semibold">Çerezmatik</span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
            <Link href="/olustur" className="hover:text-blue-600">
              Banner Oluştur
            </Link>
            <Link href="/giris" className="hover:text-blue-600">
              Giriş
            </Link>
            <Link href="/kayit" className="hover:text-blue-600">
              Kayıt Ol
            </Link>
          </nav>

          {/* Disclaimer */}
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Çerezmatik
          </p>
        </div>

        {/* Legal disclaimer */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Bu araç bilgilendirme amaçlıdır, hukuki danışmanlık yerine geçmez.
          Güncel mevzuata uygunluk için bir hukuk danışmanına başvurmanız önerilir.
        </p>
      </div>
    </footer>
  )
}
