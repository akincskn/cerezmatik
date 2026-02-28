import type { WizardData } from "@/types"

/** JS string literal içinde güvenli kullanım için escape eder. */
function esc(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029")
}

/** HTML comment içinde güvenli kullanım için `-->` dizisini kaldırır. */
function escComment(str: string): string {
  return str.replace(/-->/g, "-- >")
}

/**
 * Cookie banner JS snippet üretir.
 * Vanilla JS, bağımlılıksız, ~4KB (minify edilmemiş).
 * Rıza durumunu localStorage'da saklar.
 * Reddedilen kategoriler gerçekten yüklenmez.
 */
export function generateSnippet(data: WizardData): string {
  const { firmaBilgileri, selectedCookies, bannerTasarimi } = data

  const nonEssentialCookies = selectedCookies.filter((c) => !c.required)

  const policyUrl =
    bannerTasarimi.privacyPolicyUrl ||
    `https://cerezmatik.com/p/${slugify(firmaBilgileri.companyName)}`

  const loaders = generateLoaders(selectedCookies)
  const domain = normalizeDomain(firmaBilgileri.domain)

  // Snippet içine gömülen değerleri JS string için escape et
  const safeCompanyName = esc(firmaBilgileri.companyName)
  const safePolicyUrl = esc(policyUrl)
  const safeDomain = esc(domain)
  const safePrimaryColor = esc(bannerTasarimi.primaryColor)
  const safeTextColor = esc(bannerTasarimi.textColor)
  const safePosition = esc(bannerTasarimi.position)
  const safeButtonText = esc(bannerTasarimi.buttonText)
  const safeRejectText = esc(bannerTasarimi.rejectText)
  const safeDetailText = esc(bannerTasarimi.detailText)

  return `<!-- Çerezmatik Cookie Banner | ${escComment(firmaBilgileri.companyName)} | cerezmatik.com -->
<script>
(function() {
  'use strict';

  var CONSENT_KEY = 'cerezmatik_v1';
  var BANNER_ID   = 'cerezmatik-banner';
  var PRIMARY     = '${safePrimaryColor}';
  var TEXT_COLOR  = '${safeTextColor}';
  var POSITION    = '${safePosition}';
  var DETAIL_URL  = '${safePolicyUrl}';

  // ── Mevcut rıza kontrolü ──────────────────────────────────────────────
  var stored = null;
  try { stored = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null'); } catch(e) {}

  if (stored && stored.ts) {
    if (stored.accepted) { loadAllScripts(); }
    return;
  }

  // ── Banner HTML ───────────────────────────────────────────────────────
  var positionCSS = POSITION === 'top'
    ? 'top:0;left:0;right:0;border-bottom:3px solid rgba(0,0,0,0.15);'
    : 'bottom:0;left:0;right:0;border-top:3px solid rgba(0,0,0,0.15);';

  var banner = document.createElement('div');
  banner.id = BANNER_ID;
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Çerez Bildirimi');
  banner.style.cssText = [
    'position:fixed;' + positionCSS,
    'background:' + PRIMARY + ';',
    'color:' + TEXT_COLOR + ';',
    'padding:16px 24px;',
    'z-index:2147483647;',
    'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;',
    'font-size:14px;',
    'line-height:1.5;',
    'display:flex;',
    'flex-wrap:wrap;',
    'align-items:center;',
    'gap:12px;',
    'box-shadow:0 -4px 20px rgba(0,0,0,0.15);',
  ].join('');

  banner.innerHTML = [
    '<div style="flex:1;min-width:200px;">',
    '  <strong style="display:block;margin-bottom:4px;">${safeCompanyName} — Çerez Bildirimi</strong>',
    '  Size daha iyi hizmet sunabilmek için çerezler kullanıyoruz. ${nonEssentialCookies.length > 0 ? "Analitik ve pazarlama çerezleri için onayınızı istiyoruz." : "Yalnızca zorunlu çerezler kullanılmaktadır."}',
    '</div>',
    '<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">',
    '  <button id="cerezmatik-accept" style="',
    '    background:rgba(255,255,255,0.2);',
    '    color:' + TEXT_COLOR + ';',
    '    border:1px solid rgba(255,255,255,0.5);',
    '    padding:8px 18px;border-radius:6px;',
    '    cursor:pointer;font-size:13px;font-weight:600;',
    '    transition:background 0.2s;">',
    '    ${safeButtonText}',
    '  </button>',
    ${
      nonEssentialCookies.length > 0
        ? `'  <button id="cerezmatik-reject" style="',
    '    background:transparent;',
    '    color:' + TEXT_COLOR + ';',
    '    border:1px solid rgba(255,255,255,0.4);',
    '    padding:8px 18px;border-radius:6px;',
    '    cursor:pointer;font-size:13px;',
    '    transition:background 0.2s;">',
    '    ${safeRejectText}',
    '  </button>',`
        : ""
    }
    '  <a id="cerezmatik-detail" href="' + DETAIL_URL + '" target="_blank" rel="noopener" style="',
    '    color:' + TEXT_COLOR + ';',
    '    opacity:0.8;font-size:12px;',
    '    text-decoration:underline;cursor:pointer;">',
    '    ${safeDetailText}',
    '  </a>',
    '</div>',
  ].join('\\n');

  // ── Banner DOM'a ekle ─────────────────────────────────────────────────
  function showBanner() {
    if (document.body) {
      document.body.appendChild(banner);
      attachEvents();
    } else {
      document.addEventListener('DOMContentLoaded', function() {
        document.body.appendChild(banner);
        attachEvents();
      });
    }
  }

  function removeBanner() {
    var el = document.getElementById(BANNER_ID);
    if (el) el.parentNode.removeChild(el);
  }

  // ── Buton olayları ────────────────────────────────────────────────────
  function attachEvents() {
    document.getElementById('cerezmatik-accept').addEventListener('click', function() {
      saveConsent(true);
      loadAllScripts();
      removeBanner();
    });
    ${
      nonEssentialCookies.length > 0
        ? `var rejectBtn = document.getElementById('cerezmatik-reject');
    if (rejectBtn) {
      rejectBtn.addEventListener('click', function() {
        saveConsent(false);
        removeBanner();
      });
    }`
        : ""
    }
  }

  function saveConsent(accepted) {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({
        accepted: accepted,
        ts: Date.now(),
        domain: '${safeDomain}'
      }));
    } catch(e) {}
  }

  // ── Script yükleyiciler ───────────────────────────────────────────────
  function loadScript(src) {
    var s = document.createElement('script');
    s.src = src;
    s.async = true;
    document.head.appendChild(s);
    return s;
  }

  function loadAllScripts() {
${loaders}  }

  // ── Başlat ────────────────────────────────────────────────────────────
  showBanner();

  // Çerez tercihini değiştirme API'si (footer linki için)
  window.cerezmatik = {
    reset: function() {
      try { localStorage.removeItem(CONSENT_KEY); } catch(e) {}
      location.reload();
    },
    getConsent: function() {
      try { return JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null'); } catch(e) { return null; }
    }
  };
})();
</script>
<!-- / Çerezmatik -->`
}

// ── Script yükleyici blokları ─────────────────────────────────────────────

function generateLoaders(cookies: WizardData["selectedCookies"]): string {
  const lines: string[] = []

  for (const cookie of cookies) {
    if (cookie.required) continue

    // trackingId'yi JS string'e güvenli şekilde göm
    const tid = esc(cookie.trackingId || "")

    switch (cookie.scriptLoader) {
      case "ga": {
        const gaId = tid || "GA_MEASUREMENT_ID"
        lines.push(
          `    // Google Analytics`,
          `    loadScript('https://www.googletagmanager.com/gtag/js?id=${gaId}');`,
          `    window.dataLayer = window.dataLayer || [];`,
          `    function gtag(){dataLayer.push(arguments);}`,
          `    gtag('js', new Date());`,
          `    gtag('config', '${gaId}');`
        )
        break
      }
      case "gads": {
        const adsId = tid || "AW-CONVERSION_ID"
        lines.push(
          `    // Google Ads`,
          `    loadScript('https://www.googletagmanager.com/gtag/js?id=${adsId}');`,
          `    window.dataLayer = window.dataLayer || [];`,
          `    function gtag(){dataLayer.push(arguments);}`,
          `    gtag('js', new Date());`,
          `    gtag('config', '${adsId}');`
        )
        break
      }
      case "fbq": {
        const pixelId = tid || "PIXEL_ID"
        lines.push(
          `    // Facebook Pixel`,
          `    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?`,
          `      n.callMethod.apply(n,arguments):n.queue.push(arguments)};`,
          `      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';`,
          `      n.queue=[];t=b.createElement(e);t.async=!0;`,
          `      t.src=v;s=b.getElementsByTagName(e)[0];`,
          `      s.parentNode.insertBefore(t,s)}(window, document,'script',`,
          `      'https://connect.facebook.net/en_US/fbevents.js');`,
          `    fbq('init', '${pixelId}');`,
          `    fbq('track', 'PageView');`
        )
        break
      }
      case "hotjar": {
        // Hotjar ID sayısal olmalı — güvenli bir default ver
        const hjid = tid || "HOTJAR_ID"
        lines.push(
          `    // Hotjar`,
          `    (function(h,o,t,j,a,r){`,
          `      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};`,
          `      h._hjSettings={hjid:${hjid},hjsv:6};`,
          `      a=o.getElementsByTagName('head')[0];`,
          `      r=o.createElement('script');r.async=1;`,
          `      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;`,
          `      a.appendChild(r);`,
          `    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`
        )
        break
      }
      case "youtube":
        // YouTube embed çerezleri iframe yüklenmeden önce gelmez.
        // Gerçek bloklamak için iframe src'yi consent sonrası set etmek gerekir;
        // bu snippet bu davranışı belgelemekle yetinir.
        lines.push(
          `    // YouTube — iframe'lerinizde 'src' yerine 'data-src' kullanın`,
          `    // ve consent sonrası document.querySelectorAll('[data-src]').forEach(function(el){el.src=el.dataset.src;}); çağrısı yapın.`
        )
        break
    }
  }

  return lines.join("\n") + "\n"
}

// ── Yardımcı ──────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function normalizeDomain(domain: string): string {
  return domain.replace(/^https?:\/\//, "").replace(/\/$/, "").toLowerCase()
}
