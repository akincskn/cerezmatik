"use client"

import { useWizardStore } from "@/store/wizard"
import { Step1Firma } from "./Step1Firma"
import { Step2Cerezler } from "./Step2Cerezler"
import { Step3Tasarim } from "./Step3Tasarim"
import { Step4Ciktilar } from "./Step4Ciktilar"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2 } from "lucide-react"

const STEPS = [
  { label: "Firma Bilgileri", short: "Firma" },
  { label: "Çerez Seçimi", short: "Çerezler" },
  { label: "Tasarım", short: "Tasarım" },
  { label: "Çıktılar", short: "Çıktılar" },
]

export function WizardLayout() {
  const { step } = useWizardStore()
  const progress = ((step - 1) / (STEPS.length - 1)) * 100

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* Step indicator */}
      <div className="mb-8">
        <Progress value={progress} className="mb-4 h-2" />
        <div className="flex justify-between">
          {STEPS.map((s, i) => {
            const stepNum = i + 1
            const isDone = step > stepNum
            const isActive = step === stepNum

            return (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                    isDone
                      ? "bg-green-500 text-white"
                      : isActive
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : stepNum}
                </div>
                <span
                  className={`hidden text-xs sm:block ${
                    isActive ? "font-semibold text-blue-700" : "text-slate-500"
                  }`}
                >
                  {s.short}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step content card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-1 text-xl font-bold text-slate-900">
          {STEPS[step - 1]?.label}
        </h2>
        <p className="mb-6 text-sm text-slate-500">
          Adım {step} / {STEPS.length}
        </p>

        {step === 1 && <Step1Firma />}
        {step === 2 && <Step2Cerezler />}
        {step === 3 && <Step3Tasarim />}
        {step === 4 && <Step4Ciktilar />}
      </div>
    </div>
  )
}
