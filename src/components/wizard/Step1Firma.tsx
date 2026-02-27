"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { firmaBilgileriSchema, type FirmaBilgileriInput } from "@/lib/validations"
import { useWizardStore } from "@/store/wizard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Building2, Globe, Mail, Hash, User } from "lucide-react"

export function Step1Firma() {
  const { firmaBilgileri, setFirmaBilgileri, nextStep } = useWizardStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FirmaBilgileriInput>({
    resolver: zodResolver(firmaBilgileriSchema),
    defaultValues: firmaBilgileri,
  })

  function onSubmit(data: FirmaBilgileriInput) {
    setFirmaBilgileri(data)
    nextStep()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="companyName" className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-blue-500" />
          Firma Adı <span className="text-red-500">*</span>
        </Label>
        <Input
          id="companyName"
          placeholder="Örnek Yazılım A.Ş."
          {...register("companyName")}
          aria-invalid={!!errors.companyName}
        />
        {errors.companyName && (
          <p className="text-xs text-red-500">{errors.companyName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="domain" className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-blue-500" />
          Web Sitesi URL&apos;si <span className="text-red-500">*</span>
        </Label>
        <Input
          id="domain"
          placeholder="https://ornek.com"
          type="url"
          {...register("domain")}
          aria-invalid={!!errors.domain}
        />
        {errors.domain && (
          <p className="text-xs text-red-500">{errors.domain.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-blue-500" />
          İletişim E-postası <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          placeholder="info@ornek.com"
          type="email"
          {...register("email")}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dataController" className="flex items-center gap-2">
          <User className="h-4 w-4 text-blue-500" />
          Veri Sorumlusu <span className="text-red-500">*</span>
        </Label>
        <Input
          id="dataController"
          placeholder="Ad Soyad veya Firma Unvanı"
          {...register("dataController")}
          aria-invalid={!!errors.dataController}
        />
        {errors.dataController && (
          <p className="text-xs text-red-500">{errors.dataController.message}</p>
        )}
        <p className="text-xs text-slate-500">
          KVKK kapsamında kişisel verilerin sorumlusu olan kişi veya kuruluş
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mersisNo" className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-slate-400" />
          MERSİS Numarası
          <span className="ml-1 text-xs text-slate-400">(opsiyonel)</span>
        </Label>
        <Input
          id="mersisNo"
          placeholder="1234567890123456"
          maxLength={16}
          {...register("mersisNo")}
          aria-invalid={!!errors.mersisNo}
        />
        {errors.mersisNo && (
          <p className="text-xs text-red-500">{errors.mersisNo.message}</p>
        )}
      </div>

      <div className="pt-2">
        <Button type="submit" className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
          Devam Et
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
