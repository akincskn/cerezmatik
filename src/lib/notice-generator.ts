import type { WizardData } from "@/types"

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
}

/**
 * KVKK Madde 10 kapsamında Türkçe aydınlatma metni HTML'i üretir.
 */
export function generatePrivacyNotice(data: WizardData): string {
  const { firmaBilgileri, selectedCookies } = data
  const today = new Date().toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const processingPurposes = buildProcessingPurposes(selectedCookies)
  const domain = escapeHtml(normalizeDomain(firmaBilgileri.domain))
  const companyName = escapeHtml(firmaBilgileri.companyName)
  const dataController = escapeHtml(firmaBilgileri.dataController)
  const email = escapeHtml(firmaBilgileri.email)
  const mersisNo = firmaBilgileri.mersisNo ? escapeHtml(firmaBilgileri.mersisNo) : ""

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KVKK Aydınlatma Metni — ${companyName}</title>
  <style>
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
      color:#1f2937;line-height:1.7;max-width:800px;margin:0 auto;padding:40px 20px;}
    h1{font-size:26px;font-weight:700;color:#111827;margin-bottom:8px;}
    h2{font-size:18px;font-weight:600;color:#374151;margin-top:28px;
      padding-bottom:6px;border-bottom:1px solid #e5e7eb;}
    p,li{font-size:15px;color:#4b5563;}
    strong{color:#1f2937;}
    ul{padding-left:20px;}
    li{margin-bottom:6px;}
    .info-box{background:#f0f9ff;border-left:4px solid #0ea5e9;padding:14px 18px;
      border-radius:0 8px 8px 0;margin:16px 0;}
    .disclaimer{background:#fffbeb;border:1px solid #fcd34d;border-radius:8px;
      padding:16px;margin-top:40px;font-size:13px;color:#92400e;}
    .footer{margin-top:40px;padding-top:16px;border-top:1px solid #e5e7eb;
      font-size:13px;color:#9ca3af;}
  </style>
</head>
<body>
  <h1>KİŞİSEL VERİLERİN KORUNMASI KANUNU KAPSAMINDA AYDINLATMA METNİ</h1>
  <p>Son güncelleme: ${today}</p>

  <div class="info-box">
    Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu'nun ("KVKK") 10. maddesi
    uyarınca hazırlanmıştır.
  </div>

  <h2>1. Veri Sorumlusu</h2>
  <p>
    Kişisel verileriniz; <strong>${companyName}</strong>
    ${mersisNo ? `(MERSİS No: ${mersisNo})` : ""}
    tarafından, KVKK kapsamında <strong>veri sorumlusu</strong> sıfatıyla işlenmektedir.
    Veri sorumlusu temsilcisi: <strong>${dataController}</strong>.
  </p>
  <p>İletişim: <a href="mailto:${email}">${email}</a></p>

  <h2>2. İşlenen Kişisel Veriler</h2>
  <p>
    <strong>${domain}</strong> adresli web sitemizi ziyaret ettiğinizde aşağıdaki
    kişisel verileriniz işlenebilir:
  </p>
  <ul>
    <li>IP adresi ve tarayıcı bilgileri</li>
    <li>Ziyaret edilen sayfalar ve etkileşim verileri</li>
    <li>Çerezler aracılığıyla elde edilen davranış verileri</li>
    ${selectedCookies.some((c) => c.id === "google_analytics" || c.id === "hotjar") ? "<li>Anonim kullanıcı kimliği ve oturum verileri (analitik)</li>" : ""}
    ${selectedCookies.some((c) => c.id === "facebook_pixel" || c.id === "google_ads") ? "<li>Reklam etkileşim ve dönüşüm verileri (pazarlama)</li>" : ""}
  </ul>

  <h2>3. Kişisel Verilerin İşlenme Amaçları</h2>
  <ul>
    ${processingPurposes}
  </ul>

  <h2>4. Kişisel Verilerin İşlenmesinin Hukuki Dayanağı</h2>
  <ul>
    <li><strong>Meşru Menfaat (KVKK m. 5/2-f):</strong> Site güvenliği ve işlevselliğinin sağlanması.</li>
    <li><strong>Açık Rıza (KVKK m. 5/1):</strong> Analitik ve pazarlama çerezleri için açık onayınız alınmaktadır.</li>
  </ul>

  <h2>5. Kişisel Verilerin Aktarılması</h2>
  <p>
    Kişisel verileriniz; yalnızca açık rızanız dahilinde ve belirtilen amaçlar
    doğrultusunda aşağıdaki taraflara aktarılabilir:
  </p>
  <ul>
    ${buildTransferList(selectedCookies)}
  </ul>
  <p>
    Bu aktarımlar KVKK'nın 8. ve 9. maddeleri çerçevesinde ve Kişisel Verileri
    Koruma Kurulu kararlarına uygun biçimde gerçekleştirilmektedir.
  </p>

  <h2>6. Kişisel Verilerin Saklanma Süreleri</h2>
  <p>
    Kişisel verileriniz, işlenme amacının gerektirdiği süre boyunca saklanacak;
    bu sürenin dolması veya işlenme amacının ortadan kalkması halinde silinecek
    ya da anonim hâle getirilecektir. Çerez bazlı veriler için saklama süreleri
    çerez politikamızda belirtilmiştir.
  </p>

  <h2>7. KVKK Kapsamındaki Haklarınız</h2>
  <p>KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
  <ul>
    <li>Kişisel verilerinizin işlenip işlenmediğini <strong>öğrenme</strong>,</li>
    <li>İşlenmişse buna ilişkin bilgi <strong>talep etme</strong>,</li>
    <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını <strong>öğrenme</strong>,</li>
    <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri <strong>bilme</strong>,</li>
    <li>Eksik veya yanlış işlenmişse <strong>düzeltilmesini isteme</strong>,</li>
    <li>KVKK'nın 7. maddesinde öngörülen koşullar çerçevesinde <strong>silinmesini isteme</strong>,</li>
    <li>Yapılan işlemlerin aktarıldığı üçüncü kişilere bildirilmesini <strong>talep etme</strong>,</li>
    <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analizi sonucunda
        aleyhinize bir sonuç ortaya çıkmasına <strong>itiraz etme</strong>,</li>
    <li>Kanuna aykırı işleme nedeniyle <strong>zararın giderilmesini talep etme</strong>.</li>
  </ul>
  <p>
    Bu haklarınızı kullanmak için
    <a href="mailto:${email}">${email}</a>
    adresine yazılı veya elektronik ortamda başvurabilirsiniz. Başvurularınız en geç
    30 gün içinde sonuçlandırılacaktır.
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

function buildProcessingPurposes(
  cookies: WizardData["selectedCookies"]
): string {
  const purposes: string[] = ["Sitenin teknik işlevselliğinin sağlanması ve güvenliğin korunması"]

  const hasAnalytic = cookies.some((c) => c.id === "google_analytics" || c.id === "hotjar")
  const hasMarketing = cookies.some((c) => c.id === "facebook_pixel" || c.id === "google_ads")
  const hasFunctional = cookies.some((c) => c.id === "youtube")

  if (hasAnalytic) purposes.push("Site kullanım istatistiklerinin analiz edilmesi ve kullanıcı deneyiminin iyileştirilmesi")
  if (hasMarketing) purposes.push("Pazarlama kampanyalarının etkinliğinin ölçülmesi ve hedefli reklam gösterimi")
  if (hasFunctional) purposes.push("Üçüncü taraf medya içeriklerinin (video vb.) sağlanması")

  return purposes.map((p) => `<li>${p}</li>`).join("\n    ")
}

function buildTransferList(cookies: WizardData["selectedCookies"]): string {
  const transfers: string[] = ["<li><strong>Teknik altyapı sağlayıcıları</strong> (hosting, CDN) — Meşru menfaat</li>"]

  const hasGoogle = cookies.some((c) =>
    ["google_analytics", "google_ads", "youtube"].includes(c.id)
  )
  const hasMeta = cookies.some((c) => c.id === "facebook_pixel")
  const hasHotjar = cookies.some((c) => c.id === "hotjar")

  if (hasGoogle) transfers.push("<li><strong>Google LLC</strong> (ABD) — Analytics/Ads/YouTube — Açık rıza</li>")
  if (hasMeta) transfers.push("<li><strong>Meta Platforms Inc.</strong> (ABD) — Facebook Pixel — Açık rıza</li>")
  if (hasHotjar) transfers.push("<li><strong>Hotjar Ltd.</strong> (Malta) — Kullanıcı analizi — Açık rıza</li>")

  return transfers.join("\n    ")
}

function normalizeDomain(domain: string): string {
  return domain.replace(/^https?:\/\//, "").replace(/\/$/, "").toLowerCase()
}
