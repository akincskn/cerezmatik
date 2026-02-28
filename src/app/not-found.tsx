import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { SearchX } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <SearchX className="mb-6 h-16 w-16 text-slate-300" />
        <h1 className="mb-2 text-4xl font-bold text-slate-800">404</h1>
        <p className="mb-2 text-lg font-medium text-slate-600">Sayfa Bulunamadı</p>
        <p className="mb-8 max-w-md text-sm text-slate-400">
          Aradığınız sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir.
        </p>
        <Link href="/">
          <Button className="bg-blue-600 hover:bg-blue-700">Ana Sayfaya Dön</Button>
        </Link>
      </main>

      <Footer />
    </div>
  )
}
