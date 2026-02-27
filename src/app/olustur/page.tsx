import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { WizardLayout } from "@/components/wizard/WizardLayout"
import { Shield } from "lucide-react"

export const metadata = {
  title: "Banner Oluştur — Çerezmatik",
  description: "4 adımda KVKK uyumlu cookie banner, çerez politikası ve aydınlatma metni oluşturun.",
}

export default function OlusturPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-slate-50 px-4 py-10">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700">
            <Shield className="h-3.5 w-3.5" />
            Hesap gerekmez · Ücretsiz
          </div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Cookie Banner Oluştur
          </h1>
          <p className="mt-2 text-slate-500">
            Formu doldur, çerezlerini seç, snippeti kopyala.
          </p>
        </div>

        <WizardLayout />
      </main>

      <Footer />
    </div>
  )
}
