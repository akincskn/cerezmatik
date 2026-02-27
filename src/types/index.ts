// ─── Cookie Tipleri ────────────────────────────────────────────────────────

export type CookieCategory = "essential" | "analytic" | "marketing" | "functional"

export interface CookiePreset {
  id: string
  name: string
  description: string
  category: CookieCategory
  duration: string
  required: boolean
  scriptLoader?: string // GA ID placeholder vb.
}

export interface SelectedCookie extends CookiePreset {
  trackingId?: string // GA-XXXXXX gibi
  customName?: string
  customDescription?: string
}

// ─── Wizard Adımları ───────────────────────────────────────────────────────

export interface FirmaBilgileri {
  companyName: string
  domain: string
  email: string
  mersisNo?: string
  dataController: string
}

export type BannerPosition = "bottom" | "top"

export interface BannerTasarimi {
  position: BannerPosition
  primaryColor: string
  textColor: string
  buttonText: string
  rejectText: string
  detailText: string
  privacyPolicyUrl: string
}

export interface WizardData {
  firmaBilgileri: FirmaBilgileri
  selectedCookies: SelectedCookie[]
  bannerTasarimi: BannerTasarimi
}

// ─── Üretilen Çıktılar ────────────────────────────────────────────────────

export interface GeneratedOutputs {
  bannerScript: string
  cookiePolicy: string
  privacyNotice: string
}

// ─── API Response ─────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

// ─── Dashboard ────────────────────────────────────────────────────────────

export interface SiteListItem {
  id: string
  slug: string
  companyName: string
  domain: string
  createdAt: string
  hasOutput: boolean
}
