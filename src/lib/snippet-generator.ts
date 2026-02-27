import type { WizardData } from "@/types"

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

  return `<!-- Çerezmatik Cookie Banner | ${firmaBilgileri.companyName} | cerezmatik.com -->
<script>
(function() {
  'use strict';

  var CONSENT_KEY = 'cerezmatik_v1';
  var BANNER_ID   = 'cerezmatik-banner';
  var PRIMARY     = '${bannerTasarimi.primaryColor}';
  var TEXT_COLOR  = '${bannerTasarimi.textColor}';
  var POSITION    = '${bannerTasarimi.position}';
  var DETAIL_URL  = '${policyUrl}';

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
    '  <strong style="display:block;margin-bottom:4px;">${firmaBilgileri.companyName} — Çerez Bildirimi</strong>',
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
    '    ${bannerTasarimi.buttonText}',
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
    '    ${bannerTasarimi.rejectText}',
    '  </button>',`
        : ""
    }
    '  <a id="cerezmatik-detail" href="' + DETAIL_URL + '" target="_blank" rel="noopener" style="',
    '    color:' + TEXT_COLOR + ';',
    '    opacity:0.8;font-size:12px;',
    '    text-decoration:underline;cursor:pointer;">',
    '    ${bannerTasarimi.detailText}',
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
        domain: '${domain}'
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

    switch (cookie.scriptLoader) {
      case "ga":
        lines.push(
          `    // Google Analytics`,
          `    loadScript('https://www.googletagmanager.com/gtag/js?id=${cookie.trackingId || "GA_MEASUREMENT_ID"}');`,
          `    window.dataLayer = window.dataLayer || [];`,
          `    function gtag(){dataLayer.push(arguments);}`,
          `    gtag('js', new Date());`,
          `    gtag('config', '${cookie.trackingId || "GA_MEASUREMENT_ID"}');`
        )
        break
      case "gads":
        lines.push(
          `    // Google Ads`,
          `    loadScript('https://www.googletagmanager.com/gtag/js?id=${cookie.trackingId || "AW-CONVERSION_ID"}');`,
          `    window.dataLayer = window.dataLayer || [];`,
          `    function gtag(){dataLayer.push(arguments);}`,
          `    gtag('js', new Date());`,
          `    gtag('config', '${cookie.trackingId || "AW-CONVERSION_ID"}');`
        )
        break
      case "fbq":
        lines.push(
          `    // Facebook Pixel`,
          `    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?`,
          `      n.callMethod.apply(n,arguments):n.queue.push(arguments)};`,
          `      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';`,
          `      n.queue=[];t=b.createElement(e);t.async=!0;`,
          `      t.src=v;s=b.getElementsByTagName(e)[0];`,
          `      s.parentNode.insertBefore(t,s)}(window, document,'script',`,
          `      'https://connect.facebook.net/en_US/fbevents.js');`,
          `    fbq('init', '${cookie.trackingId || "PIXEL_ID"}');`,
          `    fbq('track', 'PageView');`
        )
        break
      case "hotjar":
        lines.push(
          `    // Hotjar`,
          `    (function(h,o,t,j,a,r){`,
          `      h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};`,
          `      h._hjSettings={hjid:${cookie.trackingId || "HOTJAR_ID"},hjsv:6};`,
          `      a=o.getElementsByTagName('head')[0];`,
          `      r=o.createElement('script');r.async=1;`,
          `      r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;`,
          `      a.appendChild(r);`,
          `    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`
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
