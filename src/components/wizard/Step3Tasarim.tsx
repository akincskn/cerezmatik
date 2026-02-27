"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { bannerTasarimiSchema, type BannerTasarimiInput } from "@/lib/validations"
import { useWizardStore } from "@/store/wizard"
import type { BannerTasarimi } from "@/types"
import { BannerPreview } from "@/components/banner/BannerPreview"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, ArrowLeft, Palette, AlignVerticalJustifyStart, AlignVerticalJustifyEnd } from "lucide-react"

const PRESET_COLORS = [
  { label: "Lacivert", value: "#1e40af" },
  { label: "Koyu Yeşil", value: "#166534" },
  { label: "Antrasit", value: "#1e293b" },
  { label: "Mor", value: "#6d28d9" },
  { label: "Kırmızı", value: "#991b1b" },
  { label: "Petrol", value: "#0f766e" },
]

export function Step3Tasarim() {
  const { firmaBilgileri, selectedCookies, bannerTasarimi, setBannerTasarimi, nextStep, prevStep } =
    useWizardStore()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BannerTasarimiInput>({
    resolver: zodResolver(bannerTasarimiSchema),
    defaultValues: bannerTasarimi,
  })

  const watched = watch()
  const hasNonEssential = selectedCookies.some((c) => !c.required)

  function onSubmit(data: BannerTasarimiInput) {
    setBannerTasarimi(data)
    nextStep()
  }

  // Anlık önizleme için store'u güncelle (her değişimde)
  function handleFieldChange(field: keyof BannerTasarimiInput, value: string) {
    setBannerTasarimi({ [field]: value })
    setValue(field, value as never)
  }

  return (
    <div className="space-y-6">
      {/* Form + Önizleme grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} id="step3-form" className="space-y-5">
          {/* Pozisyon */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-blue-500" />
              Banner Pozisyonu
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "bottom", label: "Alt", Icon: AlignVerticalJustifyEnd },
                { value: "top", label: "Üst", Icon: AlignVerticalJustifyStart },
              ].map(({ value, label, Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleFieldChange("position", value)}
                  className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors ${
                    watched.position === value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Renk */}
          <div className="space-y-2">
            <Label>Arka Plan Rengi</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  title={c.label}
                  onClick={() => handleFieldChange("primaryColor", c.value)}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    watched.primaryColor === c.value
                      ? "scale-110 border-white ring-2 ring-blue-500"
                      : "border-white"
                  }`}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                {...register("primaryColor")}
                onChange={(e) => handleFieldChange("primaryColor", e.target.value)}
                className="h-8 w-8 cursor-pointer rounded border border-slate-300"
              />
              <span className="text-xs text-slate-500">Özel renk seç</span>
              {errors.primaryColor && (
                <p className="text-xs text-red-500">{errors.primaryColor.message}</p>
              )}
            </div>
          </div>

          {/* Yazı rengi */}
          <div className="space-y-2">
            <Label>Yazı Rengi</Label>
            <div className="flex items-center gap-3">
              {["#ffffff", "#000000", "#1e293b"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleFieldChange("textColor", c)}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    watched.textColor === c
                      ? "scale-110 border-blue-500"
                      : "border-slate-300"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input
                type="color"
                {...register("textColor")}
                onChange={(e) => handleFieldChange("textColor", e.target.value)}
                className="h-8 w-8 cursor-pointer rounded border border-slate-300"
              />
            </div>
          </div>

          {/* Buton metinleri */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { id: "buttonText", label: "Kabul Butonu", placeholder: "Kabul Et" },
              { id: "rejectText", label: "Reddet Butonu", placeholder: "Reddet", show: hasNonEssential },
              { id: "detailText", label: "Detay Linki", placeholder: "Detaylı Bilgi" },
            ]
              .filter((f) => f.show !== false)
              .map((field) => (
                <div key={field.id} className="space-y-1">
                  <Label className="text-xs">{field.label}</Label>
                  <Input
                    placeholder={field.placeholder}
                    {...register(field.id as keyof BannerTasarimiInput)}
                    onChange={(e) =>
                      handleFieldChange(field.id as keyof BannerTasarimiInput, e.target.value)
                    }
                    className="h-8 text-sm"
                  />
                  {errors[field.id as keyof BannerTasarimiInput] && (
                    <p className="text-xs text-red-500">
                      {errors[field.id as keyof BannerTasarimiInput]?.message}
                    </p>
                  )}
                </div>
              ))}
          </div>

          {/* Çerez politikası URL */}
          <div className="space-y-1">
            <Label className="text-xs">
              Çerez Politikası URL&apos;si
              <span className="ml-1 text-slate-400">(opsiyonel)</span>
            </Label>
            <Input
              placeholder="https://siteniz.com/cerez-politikasi"
              {...register("privacyPolicyUrl")}
              onChange={(e) => handleFieldChange("privacyPolicyUrl", e.target.value)}
              className="h-8 text-sm"
            />
            {errors.privacyPolicyUrl && (
              <p className="text-xs text-red-500">{errors.privacyPolicyUrl.message}</p>
            )}
            <p className="text-xs text-slate-400">
              Boş bırakırsanız Çerezmatik&apos;te oluşturulan sayfa kullanılır
            </p>
          </div>
        </form>

        {/* Önizleme */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">Canlı Önizleme</Label>
          <BannerPreview
            firma={firmaBilgileri}
            banner={watched as BannerTasarimi}
            hasNonEssential={hasNonEssential}
          />
          <p className="text-xs text-slate-400">
            Gerçek banner bu tasarımda görünecektir.
          </p>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={prevStep} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Geri
        </Button>
        <Button
          type="submit"
          form="step3-form"
          className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
        >
          Çıktıları Oluştur
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
