"use client"

import { useState } from "react"
import { useWizardStore, type CustomCookieForm as CustomCookieFormData } from "@/store/wizard"
import type { CookieCategory } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X, Plus } from "lucide-react"

const CATEGORY_OPTIONS: { value: CookieCategory; label: string }[] = [
  { value: "analytic", label: "Analitik" },
  { value: "marketing", label: "Pazarlama" },
  { value: "functional", label: "İşlevsel" },
]

const EMPTY_FORM: CustomCookieFormData = {
  name: "",
  description: "",
  category: "functional",
  duration: "",
}

interface Props {
  onClose: () => void
}

export function CustomCookieForm({ onClose }: Props) {
  const { addCustomCookie } = useWizardStore()
  const [form, setForm] = useState<CustomCookieFormData>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof CustomCookieFormData, string>>>({})

  function validate(): boolean {
    const next: typeof errors = {}
    if (!form.name.trim()) next.name = "Çerez adı boş olamaz"
    else if (form.name.trim().length < 2) next.name = "En az 2 karakter olmalıdır"
    if (!form.description.trim()) next.description = "Açıklama boş olamaz"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    addCustomCookie(form)
    onClose()
  }

  function set(field: keyof CustomCookieFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-800">Özel Çerez Ekle</h4>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-0.5 text-slate-400 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        {/* Çerez Adı */}
        <div className="space-y-1">
          <Label className="text-xs">
            Çerez Adı <span className="text-red-500">*</span>
          </Label>
          <Input
            placeholder="örn: _session_id, _preference"
            className="h-8 text-sm"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Açıklama */}
        <div className="space-y-1">
          <Label className="text-xs">
            Açıklama <span className="text-red-500">*</span>
          </Label>
          <Textarea
            placeholder="Bu çerezin ne amaçla kullanıldığını açıklayın"
            className="min-h-16 resize-none text-sm"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description}</p>
          )}
        </div>

        {/* Kategori + Süre — yan yana */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Kategori</Label>
            <Select
              value={form.category}
              onValueChange={(v) => set("category", v)}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-sm">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">
              Saklama Süresi
              <span className="ml-1 text-slate-400">(opsiyonel)</span>
            </Label>
            <Input
              placeholder="örn: 1 yıl, Oturum"
              className="h-8 text-sm"
              value={form.duration}
              onChange={(e) => set("duration", e.target.value)}
            />
          </div>
        </div>

        {/* Ekle butonu */}
        <Button
          type="button"
          onClick={handleSubmit}
          size="sm"
          className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Çerezi Ekle
        </Button>
      </div>
    </div>
  )
}
