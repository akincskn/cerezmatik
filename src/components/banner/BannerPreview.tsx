"use client"

import type { BannerTasarimi, FirmaBilgileri } from "@/types"

interface Props {
  firma: FirmaBilgileri
  banner: BannerTasarimi
  hasNonEssential: boolean
}

export function BannerPreview({ firma, banner, hasNonEssential }: Props) {
  const containerStyle: React.CSSProperties = {
    position: "relative",
    backgroundColor: banner.primaryColor,
    color: banner.textColor,
    padding: "14px 20px",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "10px",
    borderRadius: banner.position === "bottom" ? "8px 8px 0 0" : "0 0 8px 8px",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: "13px",
    lineHeight: "1.5",
    boxShadow: "0 -4px 20px rgba(0,0,0,0.12)",
  }

  const buttonBase: React.CSSProperties = {
    border: `1px solid rgba(255,255,255,0.5)`,
    borderRadius: "6px",
    padding: "6px 14px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
    color: banner.textColor,
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 shadow">
      {/* Simüle tarayıcı çubuğu */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-3 py-2">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 rounded bg-white px-2 py-0.5 text-xs text-slate-400">
          {firma.domain || "siteniz.com"}
        </div>
      </div>

      {/* Sayfa içeriği */}
      <div
        className="relative flex flex-col"
        style={{ height: "220px", background: "#f8fafc" }}
      >
        {/* İçerik placeholder */}
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6">
          <div className="h-3 w-3/4 rounded bg-slate-200" />
          <div className="h-2.5 w-1/2 rounded bg-slate-200" />
          <div className="h-2.5 w-2/3 rounded bg-slate-200" />
        </div>

        {/* Banner */}
        <div
          style={{
            ...containerStyle,
            borderRadius: "0",
            margin: 0,
          }}
        >
          <div style={{ flex: "1", minWidth: "140px" }}>
            <strong style={{ display: "block", marginBottom: "2px", fontSize: "12px" }}>
              {firma.companyName || "Firma Adı"} — Çerez Bildirimi
            </strong>
            <span style={{ fontSize: "11px", opacity: 0.9 }}>
              {hasNonEssential
                ? "Analitik ve pazarlama çerezleri için onayınızı istiyoruz."
                : "Yalnızca zorunlu çerezler kullanılmaktadır."}
            </span>
          </div>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
            <button style={{ ...buttonBase, background: "rgba(255,255,255,0.2)" }}>
              {banner.buttonText || "Kabul Et"}
            </button>
            {hasNonEssential && (
              <button style={{ ...buttonBase, background: "transparent", opacity: 0.85 }}>
                {banner.rejectText || "Reddet"}
              </button>
            )}
            <span
              style={{
                color: banner.textColor,
                opacity: 0.75,
                fontSize: "11px",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              {banner.detailText || "Detaylı Bilgi"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
