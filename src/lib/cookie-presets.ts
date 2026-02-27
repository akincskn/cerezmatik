import type { CookiePreset } from "@/types"

export const COOKIE_PRESETS: CookiePreset[] = [
  {
    id: "essential",
    name: "Zorunlu Çerezler",
    description:
      "Sitenin temel işlevleri için gereklidir. Oturum yönetimi, güvenlik ve tercih saklama gibi işlevleri kapsar.",
    category: "essential",
    duration: "Oturum / 1 yıl",
    required: true,
  },
  {
    id: "google_analytics",
    name: "Google Analytics",
    description:
      "Ziyaretçi sayısını, sayfa görüntülemelerini ve kullanıcı davranışlarını analiz eder. Google LLC tarafından işlenir.",
    category: "analytic",
    duration: "2 yıl",
    required: false,
    scriptLoader: "ga",
  },
  {
    id: "google_ads",
    name: "Google Ads (Reklam İzleme)",
    description:
      "Google reklamlarının etkinliğini ölçer ve yeniden hedefleme kampanyaları oluşturur. Google LLC tarafından işlenir.",
    category: "marketing",
    duration: "90 gün",
    required: false,
    scriptLoader: "gads",
  },
  {
    id: "facebook_pixel",
    name: "Facebook Pixel",
    description:
      "Facebook ve Instagram reklamlarının performansını ölçer, hedef kitle oluşturur. Meta Platforms tarafından işlenir.",
    category: "marketing",
    duration: "90 gün",
    required: false,
    scriptLoader: "fbq",
  },
  {
    id: "hotjar",
    name: "Hotjar",
    description:
      "Kullanıcı davranışlarını ısı haritaları ve oturum kayıtları aracılığıyla analiz eder. Hotjar Ltd. tarafından işlenir.",
    category: "analytic",
    duration: "1 yıl",
    required: false,
    scriptLoader: "hotjar",
  },
  {
    id: "youtube",
    name: "YouTube Embed",
    description:
      "Sitede gömülü YouTube videolarının oynatılabilmesi için gereklidir. Google LLC tarafından işlenir.",
    category: "functional",
    duration: "Oturum",
    required: false,
    scriptLoader: "youtube",
  },
]

export const PRESET_MAP: Record<string, CookiePreset> = Object.fromEntries(
  COOKIE_PRESETS.map((p) => [p.id, p])
)

export const CATEGORY_LABELS: Record<string, string> = {
  essential: "Zorunlu",
  analytic: "Analitik",
  marketing: "Pazarlama",
  functional: "İşlevsel",
}

export const CATEGORY_COLORS: Record<string, string> = {
  essential: "bg-green-100 text-green-800",
  analytic: "bg-blue-100 text-blue-800",
  marketing: "bg-orange-100 text-orange-800",
  functional: "bg-purple-100 text-purple-800",
}
