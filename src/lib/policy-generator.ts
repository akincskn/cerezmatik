import type { WizardData } from "@/types"
import { CATEGORY_LABELS } from "@/lib/cookie-presets"

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
}

/**
 * KVKK uyumlu Türkçe çerez politikası HTML'i üretir.
 */
export function generateCookiePolicy(data: WizardData): string {
  const { firmaBilgileri, selectedCookies } = data
  const today = new Date().toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const domain = escapeHtml(normalizeDomain(firmaBilgileri.domain))
  const companyName = escapeHtml(firmaBilgileri.companyName)
  const dataController = escapeHtml(firmaBilgileri.dataController)
  const email = escapeHtml(firmaBilgileri.email)
  const mersisNo = firmaBilgileri.mersisNo ? escapeHtml(firmaBilgileri.mersisNo) : ""
  const cookieRows = selectedCookies.map((cookie) => buildCookieRow(cookie)).join("")

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Çerez Politikası — ${companyName}</title>
  <style>
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
      color:#1f2937;line-height:1.7;max-width:800px;margin:0 auto;padding:40px 20px;}
    h1{font-size:28px;font-weight:700;color:#111827;margin-bottom:8px;}
    h2{font-size:20px;font-weight:600;color:#374151;margin-top:32px;}
    p,li{font-size:15px;color:#4b5563;}
    table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;}
    th{background:#f3f4f6;padding:10px 12px;text-align:left;font-weight:600;border:1px solid #e5e7eb;}
    td{padding:10px 12px;border:1px solid #e5e7eb;vertical-align:top;}
    .badge{display:inline-block;padding:2px 8px;border-radius:9999px;font-size:12px;font-weight:500;}
    .essential{background:#dcfce7;color:#166534;}
    .analytic{background:#dbeafe;color:#1e40af;}
    .marketing{background:#fed7aa;color:#9a3412;}
    .functional{background:#ede9fe;color:#5b21b6;}
    .disclaimer{background:#fffbeb;border:1px solid #fcd34d;border-radius:8px;padding:16px;margin-top:40px;font-size:13px;color:#92400e;}
    .footer{margin-top:40px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:13px;color:#9ca3af;}
  </style>
</head>
<body>
  <h1>Çerez Politikası</h1>
  <p>Son güncelleme: ${today}</p>

  <h2>1. Giriş</h2>
  <p>
    <strong>${companyName}</strong> olarak, <strong>${domain}</strong> adresli
    web sitemizi ziyaret ettiğinizde çerezler (cookies) kullandığımızı ve bu çerezlerin
    işlenmesinde <strong>${dataController}</strong> veri sorumlusu sıfatıyla
    hareket ettiğini bildiririz. Bu politika, Kişisel Verilerin Korunması Kanunu (KVKK)
    kapsamındaki aydınlatma yükümlülüğümüzü yerine getirmek amacıyla hazırlanmıştır.
  </p>

  <h2>2. Çerez Nedir?</h2>
  <p>
    Çerezler, ziyaret ettiğiniz web sitesi tarafından tarayıcınıza yerleştirilen küçük
    metin dosyalarıdır. Oturum yönetimi, tercih saklama, analiz ve pazarlama gibi
    amaçlarla kullanılabilirler.
  </p>

  <h2>3. Kullandığımız Çerezler</h2>
  <table>
    <thead>
      <tr>
        <th>Çerez Adı</th>
        <th>Tür</th>
        <th>Amaç</th>
        <th>Saklama Süresi</th>
      </tr>
    </thead>
    <tbody>
      ${cookieRows}
    </tbody>
  </table>

  <h2>4. Çerez Kategorileri</h2>
  <ul>
    <li><strong>Zorunlu Çerezler:</strong> Sitenin temel işlevselliği için şarttır, reddedilemez.</li>
    <li><strong>Analitik Çerezler:</strong> Ziyaretçi davranışlarını anlamamıza yardımcı olur.</li>
    <li><strong>Pazarlama Çerezleri:</strong> İlgi alanlarınıza uygun reklam gösterimini sağlar.</li>
    <li><strong>İşlevsel Çerezler:</strong> Video oynatma gibi gelişmiş site özelliklerini etkinleştirir.</li>
  </ul>

  <h2>5. Çerez Tercihlerinizi Yönetme</h2>
  <p>
    Sitemizde ilk kez belirdiğinde size sunulan çerez onay penceresinden tercihlerinizi
    belirleyebilirsiniz. Zorunlu çerezler hariç diğer çerezleri reddedebilirsiniz.
    Tercihlerinizi istediğiniz zaman değiştirmek için sayfanın alt kısmındaki
    <em>"Çerez Tercihlerimi Değiştir"</em> bağlantısını kullanabilirsiniz.
  </p>
  <p>
    Tarayıcı ayarlarından da çerezleri yönetebilirsiniz; ancak bu durumda sitenin
    bazı işlevleri çalışmayabilir.
  </p>

  <h2>6. Üçüncü Taraf Çerezleri</h2>
  <p>
    ${hasThirdParty(selectedCookies) ? `Sitemizde Google LLC, Meta Platforms Inc. ve diğer üçüncü taraflara ait çerezler
    kullanılmaktadır. Bu çerezlere ilişkin gizlilik uygulamaları ilgili şirketlerin
    politikalarına tabidir. Daha fazla bilgi için Google Gizlilik Politikası ve
    Meta Veri Politikası belgelerini inceleyebilirsiniz.` : `Sitemizde yalnızca birinci taraf çerezler kullanılmaktadır.`}
  </p>

  <h2>7. İletişim</h2>
  <p>
    Çerez politikamıza ilişkin sorularınız için <a href="mailto:${email}">${email}</a>
    adresine ulaşabilirsiniz.
    ${mersisNo ? `MERSİS No: ${mersisNo}` : ""}
  </p>

  <div class="disclaimer">
    <strong>⚠ Uyarı:</strong> Bu metin <a href="https://cerezmatik.com" target="_blank" rel="noopener">Çerezmatik</a>
    tarafından oluşturulmuştur ve bilgilendirme amaçlıdır. Hukuki danışmanlık yerine geçmez.
    Güncel mevzuata uygunluk için bir hukuk danışmanına başvurmanız önerilir.
  </div>

  <div class="footer">
    Oluşturuldu: <a href="https://cerezmatik.com" target="_blank" rel="noopener">Çerezmatik</a> — ${today}
  </div>
</body>
</html>`
}

// ── Yardımcı ──────────────────────────────────────────────────────────────

function buildCookieRow(cookie: WizardData["selectedCookies"][number]): string {
  const categoryLabel = CATEGORY_LABELS[cookie.category] ?? cookie.category
  const badgeClass = cookie.category

  return `<tr>
    <td><strong>${escapeHtml(cookie.name)}</strong></td>
    <td><span class="badge ${badgeClass}">${escapeHtml(categoryLabel)}</span></td>
    <td>${escapeHtml(cookie.description)}</td>
    <td>${escapeHtml(cookie.duration)}</td>
  </tr>`
}

function hasThirdParty(cookies: WizardData["selectedCookies"]): boolean {
  const thirdParty = ["google_analytics", "google_ads", "facebook_pixel", "hotjar", "youtube"]
  return cookies.some((c) => thirdParty.includes(c.id))
}

function normalizeDomain(domain: string): string {
  return domain.replace(/^https?:\/\//, "").replace(/\/$/, "").toLowerCase()
}
