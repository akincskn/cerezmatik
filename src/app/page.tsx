import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Zap,
  Code2,
  FileText,
  CheckCircle2,
  ArrowRight,
  Lock,
  BarChart3,
  Megaphone,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 px-4 py-20 text-white sm:py-28">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute left-1/4 top-10 h-64 w-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-1/3 h-96 w-96 rounded-full bg-blue-300 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <Badge className="mb-4 border-blue-400 bg-blue-800/50 text-blue-200">
            Ücretsiz · Hesap Gerekmez · Türkçe
          </Badge>

          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            3 Dakikada{" "}
            <span className="text-green-400">KVKK Uyumlu</span>
            <br />
            Cookie Banner
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100 sm:text-xl">
            Firma bilgilerinizi girin, çerezlerinizi seçin, snippet&apos;i kopyalayın.
            Çerez politikası ve aydınlatma metni otomatik oluşsun.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/olustur">
              <Button
                size="lg"
                className="gap-2 bg-green-500 px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-green-600"
              >
                Ücretsiz Başla
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-blue-200">
              Kayıt gerektirmez · 5 dakikada tamamla
            </p>
          </div>
        </div>
      </section>

      {/* ── Nasıl Çalışır ───────────────────────────────────────────── */}
      <section className="bg-white px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-slate-900">Nasıl Çalışır?</h2>
            <p className="text-slate-500">4 kolay adımda KVKK uyumlu ol</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="relative rounded-xl border border-slate-100 bg-slate-50 p-6"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mb-2 font-semibold text-slate-900">{step.title}</h3>
                <p className="text-sm text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Özellikler ──────────────────────────────────────────────── */}
      <section className="bg-slate-50 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-slate-900">
              Tek Araçta Her Şey
            </h2>
            <p className="text-slate-500">
              KVKK uyumu için ihtiyacınız olan tüm belgeler
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-3">
                  <f.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-2 font-semibold text-slate-900">{f.title}</h3>
                <p className="text-sm text-slate-500">{f.desc}</p>
                <ul className="mt-4 space-y-1">
                  {f.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Çerez Tipleri ───────────────────────────────────────────── */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-2xl font-bold text-slate-900">
              Desteklenen Çerez Servisleri
            </h2>
            <p className="text-slate-500">Hangi servisleri kullandığınızı seçin, gerisini biz halledelim</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {COOKIE_SERVICES.map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <div>
                  <p className="text-sm font-medium text-slate-800">{s.name}</p>
                  <p className="text-xs text-slate-500">{s.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-800 px-4 py-16 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Hemen Başla, Ücretsiz</h2>
          <p className="mb-8 text-blue-100">
            Kayıt olmadan kullan. İstersen kaydol ve oluşturduklarını kaydet.
          </p>
          <Link href="/olustur">
            <Button
              size="lg"
              className="gap-2 bg-white px-8 text-blue-700 hover:bg-blue-50"
            >
              Cookie Banner Oluştur
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

// ── Data ──────────────────────────────────────────────────────────────────

const STEPS = [
  {
    title: "Firma Bilgileri",
    desc: "Şirket adı, alan adı ve iletişim bilgilerini girin.",
  },
  {
    title: "Çerez Seçimi",
    desc: "Hangi analitik ve pazarlama araçlarını kullandığınızı seçin.",
  },
  {
    title: "Tasarım",
    desc: "Banner rengini, pozisyonunu ve buton metinlerini özelleştirin.",
  },
  {
    title: "Çıktılar",
    desc: "JS snippet&apos;i, çerez politikasını ve aydınlatma metnini kopyalayın.",
  },
]

const FEATURES = [
  {
    icon: Code2,
    title: "Cookie Banner",
    desc: "Sitenize kopyala-yapıştır yapın, anında çalışsın.",
    items: [
      "Vanilla JS, bağımlılıksız",
      "Kabul / Reddet / Detaylı Bilgi",
      "Script injection bloklama",
      "localStorage rıza saklama",
    ],
  },
  {
    icon: FileText,
    title: "Çerez Politikası",
    desc: "Seçilen çerezlere göre otomatik Türkçe metin.",
    items: [
      "Her çerez için detaylı tablo",
      "KVKK uyumlu içerik",
      "Kopyalanabilir HTML",
      "Host edilmiş sayfa seçeneği",
    ],
  },
  {
    icon: Shield,
    title: "Aydınlatma Metni",
    desc: "KVKK Madde 10 kapsamında standart şablon.",
    items: [
      "Veri sorumlusu bilgileri",
      "İşleme amaçları",
      "Hukuki dayanaklar",
      "Kullanıcı hakları",
    ],
  },
]

const COOKIE_SERVICES = [
  { name: "Google Analytics", category: "Analitik", icon: BarChart3, color: "text-orange-500" },
  { name: "Google Ads", category: "Pazarlama", icon: Megaphone, color: "text-blue-500" },
  { name: "Facebook Pixel", category: "Pazarlama", icon: Zap, color: "text-blue-700" },
  { name: "Hotjar", category: "Analitik", icon: BarChart3, color: "text-red-500" },
  { name: "YouTube Embed", category: "İşlevsel", icon: Zap, color: "text-red-600" },
  { name: "Özel Çerez", category: "Tanımlanabilir", icon: Lock, color: "text-slate-500" },
]
