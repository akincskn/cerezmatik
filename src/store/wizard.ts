import { create } from "zustand"
import type { FirmaBilgileri, BannerTasarimi, SelectedCookie, CookieCategory } from "@/types"
import { COOKIE_PRESETS } from "@/lib/cookie-presets"

export type WizardStep = 1 | 2 | 3 | 4

const CUSTOM_COOKIE_LIMIT = 5

export interface CustomCookieForm {
  name: string
  description: string
  category: CookieCategory
  duration: string
}

interface WizardState {
  step: WizardStep
  firmaBilgileri: FirmaBilgileri
  selectedCookies: SelectedCookie[]
  bannerTasarimi: BannerTasarimi

  // Actions
  setStep: (step: WizardStep) => void
  nextStep: () => void
  prevStep: () => void
  setFirmaBilgileri: (data: FirmaBilgileri) => void
  toggleCookie: (cookieId: string) => void
  updateCookieField: (
    cookieId: string,
    field: "trackingId" | "customName" | "customDescription",
    value: string
  ) => void
  addCustomCookie: (form: CustomCookieForm) => void
  removeCustomCookie: (cookieId: string) => void
  setBannerTasarimi: (data: Partial<BannerTasarimi>) => void
  reset: () => void
}

const DEFAULT_FIRMA: FirmaBilgileri = {
  companyName: "",
  domain: "",
  email: "",
  mersisNo: "",
  dataController: "",
}

const DEFAULT_BANNER: BannerTasarimi = {
  position: "bottom",
  primaryColor: "#1e40af",
  textColor: "#ffffff",
  buttonText: "Kabul Et",
  rejectText: "Reddet",
  detailText: "Detaylı Bilgi",
  privacyPolicyUrl: "",
}

const INITIAL_COOKIES: SelectedCookie[] = [
  { ...COOKIE_PRESETS.find((p) => p.id === "essential")! },
]

export const useWizardStore = create<WizardState>()((set) => ({
  step: 1,
  firmaBilgileri: DEFAULT_FIRMA,
  selectedCookies: INITIAL_COOKIES,
  bannerTasarimi: DEFAULT_BANNER,

  setStep: (step) => set({ step }),

  nextStep: () =>
    set((state) => ({ step: Math.min(4, state.step + 1) as WizardStep })),

  prevStep: () =>
    set((state) => ({ step: Math.max(1, state.step - 1) as WizardStep })),

  setFirmaBilgileri: (data) => set({ firmaBilgileri: data }),

  toggleCookie: (cookieId) =>
    set((state) => {
      if (cookieId === "essential") return state

      const isSelected = state.selectedCookies.some((c) => c.id === cookieId)

      if (isSelected) {
        return { selectedCookies: state.selectedCookies.filter((c) => c.id !== cookieId) }
      }

      const preset = COOKIE_PRESETS.find((p) => p.id === cookieId)
      if (!preset) return state

      return { selectedCookies: [...state.selectedCookies, { ...preset }] }
    }),

  updateCookieField: (cookieId, field, value) =>
    set((state) => ({
      selectedCookies: state.selectedCookies.map((c) =>
        c.id === cookieId ? { ...c, [field]: value } : c
      ),
    })),

  addCustomCookie: (form) =>
    set((state) => {
      const customCount = state.selectedCookies.filter((c) =>
        c.id.startsWith("custom_")
      ).length

      if (customCount >= CUSTOM_COOKIE_LIMIT) return state

      const id = `custom_${Date.now()}`
      const newCookie: SelectedCookie = {
        id,
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        duration: form.duration.trim() || "Oturum",
        required: false,
      }

      return { selectedCookies: [...state.selectedCookies, newCookie] }
    }),

  removeCustomCookie: (cookieId) =>
    set((state) => ({
      selectedCookies: state.selectedCookies.filter((c) => c.id !== cookieId),
    })),

  setBannerTasarimi: (data) =>
    set((state) => ({ bannerTasarimi: { ...state.bannerTasarimi, ...data } })),

  reset: () =>
    set({
      step: 1,
      firmaBilgileri: DEFAULT_FIRMA,
      selectedCookies: INITIAL_COOKIES,
      bannerTasarimi: DEFAULT_BANNER,
    }),
}))
