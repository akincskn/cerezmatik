"use client"

import { useState } from "react"
import { useWizardStore } from "@/store/wizard"
import { COOKIE_PRESETS, CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/cookie-presets"
import { CustomCookieForm } from "./CustomCookieForm"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowRight, ArrowLeft, Lock, Info, Plus, Trash2 } from "lucide-react"

const CUSTOM_COOKIE_LIMIT = 5

export function Step2Cerezler() {
  const { selectedCookies, toggleCookie, updateCookieField, removeCustomCookie, nextStep, prevStep } =
    useWizardStore()

  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showCustomForm, setShowCustomForm] = useState(false)

  const isSelected = (id: string) => selectedCookies.some((c) => c.id === id)
  const customCookies = selectedCookies.filter((c) => c.id.startsWith("custom_"))
  const hasNonEssential = selectedCookies.some((c) => !c.required)
  const canAddMore = customCookies.length < CUSTOM_COOKIE_LIMIT

  function handleToggle(id: string) {
    if (id === "essential") return
    toggleCookie(id)
    if (!isSelected(id)) setExpandedId(id)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Sitenizde kullandığınız servisleri seçin. Zorunlu çerezler her zaman etkindir.
      </p>

      {/* ── Hazır presetler ── */}
      <div className="space-y-3">
        {COOKIE_PRESETS.map((preset) => {
          const selected = isSelected(preset.id)
          const expanded = expandedId === preset.id && selected && !!preset.scriptLoader

          return (
            <div
              key={preset.id}
              className={`rounded-lg border transition-colors ${
                selected
                  ? "border-blue-200 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-start gap-3 p-4">
                {preset.required ? (
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                ) : (
                  <Checkbox
                    id={`cookie-${preset.id}`}
                    checked={selected}
                    onCheckedChange={() => handleToggle(preset.id)}
                    className="mt-0.5"
                  />
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Label
                      htmlFor={preset.required ? undefined : `cookie-${preset.id}`}
                      className="cursor-pointer font-medium text-slate-900"
                    >
                      {preset.name}
                    </Label>
                    <Badge
                      className={`text-xs ${CATEGORY_COLORS[preset.category]}`}
                      variant="outline"
                    >
                      {CATEGORY_LABELS[preset.category]}
                    </Badge>
                    {preset.required && (
                      <Badge variant="outline" className="border-slate-300 text-xs text-slate-500">
                        Zorunlu
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{preset.description}</p>
                  <p className="mt-0.5 text-xs text-slate-400">Süre: {preset.duration}</p>

                  {/* Tracking ID girişi */}
                  {expanded && (
                    <div className="mt-3 space-y-1">
                      <Label className="flex items-center gap-1 text-xs text-slate-600">
                        <Info className="h-3 w-3" />
                        {preset.id === "hotjar"
                          ? "Hotjar Site ID"
                          : preset.id === "facebook_pixel"
                          ? "Pixel ID"
                          : "Ölçüm / Dönüşüm ID"}
                        <span className="text-slate-400">(opsiyonel)</span>
                      </Label>
                      <Input
                        placeholder={
                          preset.id === "google_analytics"
                            ? "G-XXXXXXXXXX"
                            : preset.id === "google_ads"
                            ? "AW-XXXXXXXXX"
                            : preset.id === "facebook_pixel"
                            ? "1234567890"
                            : "1234567"
                        }
                        className="h-8 text-xs"
                        defaultValue={
                          selectedCookies.find((c) => c.id === preset.id)?.trackingId ?? ""
                        }
                        onChange={(e) =>
                          updateCookieField(preset.id, "trackingId", e.target.value)
                        }
                      />
                      <p className="text-xs text-slate-400">
                        Boş bırakırsanız placeholder değer kullanılır
                      </p>
                    </div>
                  )}

                  {selected && preset.scriptLoader && !expanded && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(expandedId === preset.id ? null : preset.id)
                      }
                      className="mt-2 text-xs text-blue-600 underline-offset-2 hover:underline"
                    >
                      ID Gir (opsiyonel)
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Özel çerezler ── */}
      {customCookies.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-600">
            Özel Çerezleriniz ({customCookies.length}/{CUSTOM_COOKIE_LIMIT})
          </p>
          {customCookies.map((cookie) => (
            <div
              key={cookie.id}
              className="flex items-start gap-3 rounded-lg border border-violet-200 bg-violet-50 p-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-slate-900">{cookie.name}</span>
                  <Badge
                    className={`text-xs ${CATEGORY_COLORS[cookie.category]}`}
                    variant="outline"
                  >
                    {CATEGORY_LABELS[cookie.category]}
                  </Badge>
                  <Badge variant="outline" className="border-violet-300 text-xs text-violet-600">
                    Özel
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-slate-500">{cookie.description}</p>
                <p className="mt-0.5 text-xs text-slate-400">Süre: {cookie.duration}</p>
              </div>
              <button
                type="button"
                onClick={() => removeCustomCookie(cookie.id)}
                className="mt-0.5 rounded p-1 text-slate-400 transition-colors hover:bg-red-100 hover:text-red-600"
                aria-label={`${cookie.name} çerezini kaldır`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Özel çerez ekle butonu / form ── */}
      {showCustomForm ? (
        <CustomCookieForm onClose={() => setShowCustomForm(false)} />
      ) : (
        canAddMore && (
          <button
            type="button"
            onClick={() => setShowCustomForm(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 py-3 text-sm text-slate-500 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
          >
            <Plus className="h-4 w-4" />
            Özel çerez ekle
            {customCookies.length > 0 && (
              <span className="text-xs text-slate-400">
                ({CUSTOM_COOKIE_LIMIT - customCookies.length} hak kaldı)
              </span>
            )}
          </button>
        )
      )}

      {hasNonEssential && (
        <div className="rounded-md bg-amber-50 px-4 py-3 text-xs text-amber-700">
          <strong>Not:</strong> Analitik ve pazarlama çerezleri için kullanıcı onayı alınacaktır.
          Kullanıcı &quot;Reddet&quot; seçerse bu scriptler yüklenmeyecektir.
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={prevStep} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Geri
        </Button>
        <Button
          type="button"
          onClick={nextStep}
          className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
        >
          Devam Et
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
