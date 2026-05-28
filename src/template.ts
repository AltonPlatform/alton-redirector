import {
  type Locale,
  getMessages,
  translationsJson,
} from "./i18n";

export interface PageParams {
  refCode: string;
  appStoreUrl: string;
  googlePlayUrl: string;
  homeUrl: string;
  locale: Locale;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeJsString(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/</g, "\\u003c");
}

export function renderPage(params: PageParams): string {
  const messages = getMessages(params.locale);
  const locale = escapeHtml(params.locale);
  const refCode = escapeHtml(params.refCode);
  const appStoreUrl = escapeHtml(params.appStoreUrl);
  const googlePlayUrl = escapeHtml(params.googlePlayUrl);
  const faviconUrl = escapeHtml(`${params.homeUrl.replace(/\/$/, "")}/favicon.ico`);

  const refCodeJs = escapeJsString(params.refCode);
  const appStoreUrlJs = escapeJsString(params.appStoreUrl);
  const googlePlayUrlJs = escapeJsString(params.googlePlayUrl);
  const i18nJson = escapeJsString(translationsJson());
  const serverLocaleJs = escapeJsString(params.locale);

  const subtitle = escapeHtml(messages.subtitle);
  const qrAlt = escapeHtml(messages.qrAlt);
  const appStore = escapeHtml(messages.appStore);
  const googlePlay = escapeHtml(messages.googlePlay);
  const desktopHint = escapeHtml(messages.desktopHint);
  const noscriptRedirect = escapeHtml(messages.noscriptRedirect);

  const qrUrl = escapeHtml(
    `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(params.appStoreUrl)}`
  );

  const isRtl = params.locale === "ar";

  return `<!DOCTYPE html>
<html lang="${locale}"${isRtl ? ' dir="rtl"' : ""}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="${faviconUrl}">
  <title>Alton Trader</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a0f;
      color: #e8e8f0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 24px;
    }

    .container {
      text-align: center;
      max-width: 400px;
      width: 100%;
    }

    .logo {
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #ffffff 0%, #a0a0c0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: 15px;
      color: #8888a0;
      margin-bottom: 32px;
    }

    .spinner-wrap {
      display: flex;
      justify-content: center;
      margin-bottom: 24px;
    }

    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid #1e1e2e;
      border-top-color: #6c6cff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .desktop-block {
      display: none;
    }

    .desktop-block.visible {
      display: block;
    }

    .qr-wrap {
      margin: 24px auto;
      background: #ffffff;
      border-radius: 12px;
      padding: 12px;
      display: inline-block;
    }

    .qr-wrap img {
      display: block;
      width: 176px;
      height: 176px;
    }

    .buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 8px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 14px 24px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      transition: opacity 0.2s;
    }

    .btn:hover { opacity: 0.85; }

    .btn-appstore {
      background: #ffffff;
      color: #0a0a0f;
    }

    .btn-playstore {
      background: #1e1e2e;
      color: #e8e8f0;
      border: 1px solid #2e2e40;
    }

    .desktop-hint {
      font-size: 13px;
      color: #666680;
      margin-top: 16px;
    }

    noscript .noscript-links {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 24px;
    }

    noscript a {
      display: inline-block;
      padding: 14px 24px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      background: #1e1e2e;
      color: #e8e8f0;
      border: 1px solid #2e2e40;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Alton Trader</div>
    <p class="subtitle" data-i18n="subtitle">${subtitle}</p>

    <div class="spinner-wrap" id="spinner">
      <div class="spinner"></div>
    </div>

    <div class="desktop-block" id="desktop-block">
      <div class="qr-wrap">
        <img src="${qrUrl}" width="176" height="176" alt="${qrAlt}" data-i18n-alt="qrAlt">
      </div>
      <div class="buttons">
        <a class="btn btn-appstore" id="btn-appstore" href="${appStoreUrl}" data-i18n="appStore">${appStore}</a>
        <a class="btn btn-playstore" id="btn-playstore" href="${googlePlayUrl}" data-i18n="googlePlay">${googlePlay}</a>
      </div>
      <p class="desktop-hint" data-i18n="desktopHint">${desktopHint}</p>
    </div>
  </div>

  <noscript>
    <meta http-equiv="refresh" content="3;url=${appStoreUrl}">
    <div class="container">
      <p class="subtitle" data-i18n="noscriptRedirect">${noscriptRedirect}</p>
      <div class="noscript-links">
        <a href="${appStoreUrl}" data-i18n="appStore">${appStore}</a>
        <a href="${googlePlayUrl}" data-i18n="googlePlay">${googlePlay}</a>
      </div>
    </div>
  </noscript>

  <script>
  (function () {
    var I18N = JSON.parse('${i18nJson}');
    var SUPPORTED = ['en','ru','id','zh','es','ar','tr','pt','de','fr'];
    var DEFAULT_LOCALE = 'en';
    var SERVER_LOCALE = '${serverLocaleJs}';

    function normalizeTag(tag) {
      return tag.trim().toLowerCase().split(';')[0].split('-')[0];
    }

    function matchLocale(code) {
      return SUPPORTED.indexOf(code) !== -1 ? code : null;
    }

    function resolveBrowserLocale() {
      var tags = [];
      if (navigator.languages && navigator.languages.length) {
        tags = Array.prototype.slice.call(navigator.languages);
      } else if (navigator.language) {
        tags = [navigator.language];
      }

      for (var i = 0; i < tags.length; i++) {
        var locale = matchLocale(normalizeTag(tags[i]));
        if (locale) return locale;
      }
      return DEFAULT_LOCALE;
    }

    function applyLocale(locale) {
      var messages = I18N[locale] || I18N[DEFAULT_LOCALE];
      if (!messages) return;

      document.documentElement.lang = locale;
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';

      var textNodes = document.querySelectorAll('[data-i18n]');
      for (var i = 0; i < textNodes.length; i++) {
        var key = textNodes[i].getAttribute('data-i18n');
        if (key && messages[key]) textNodes[i].textContent = messages[key];
      }

      var altNodes = document.querySelectorAll('[data-i18n-alt]');
      for (var j = 0; j < altNodes.length; j++) {
        var altKey = altNodes[j].getAttribute('data-i18n-alt');
        if (altKey && messages[altKey]) altNodes[j].setAttribute('alt', messages[altKey]);
      }
    }

    var browserLocale = resolveBrowserLocale();
    if (browserLocale !== SERVER_LOCALE) {
      applyLocale(browserLocale);
    }

    var REF_CODE = '${refCodeJs}';
    var APP_STORE_URL = '${appStoreUrlJs}';
    var GOOGLE_PLAY_URL = '${googlePlayUrlJs}';
    var CLICK_URL = '/referral/click';
    var REDIRECT_DELAY = 300;

    function sha256(text) {
      var encoder = new TextEncoder();
      return crypto.subtle.digest('SHA-256', encoder.encode(text)).then(function (buf) {
        return Array.from(new Uint8Array(buf))
          .map(function (b) { return b.toString(16).padStart(2, '0'); })
          .join('');
      });
    }

    function getCanvasFingerprint() {
      try {
        var canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 50;
        var ctx = canvas.getContext('2d');
        if (!ctx) return Promise.resolve(null);

        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillStyle = '#f60';
        ctx.fillRect(0, 0, 100, 50);
        ctx.fillStyle = '#069';
        ctx.fillText('Alton Trader', 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('Alton Trader', 4, 17);
        ctx.beginPath();
        ctx.arc(50, 25, 10, 0, Math.PI * 2);
        ctx.fill();

        return sha256(canvas.toDataURL());
      } catch (e) {
        return Promise.resolve(null);
      }
    }

    function getWebGLFingerprint() {
      try {
        var canvas = document.createElement('canvas');
        var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return Promise.resolve(null);

        var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (!debugInfo) return Promise.resolve(null);

        var renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        var vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        var raw = vendor + '~' + renderer;

        return sha256(raw);
      } catch (e) {
        return Promise.resolve(null);
      }
    }

    function collectFingerprint() {
      return Promise.all([getCanvasFingerprint(), getWebGLFingerprint()]).then(function (results) {
        return {
          canvas: results[0],
          webgl: results[1],
          screen: {
            width: screen.width,
            height: screen.height,
            colorDepth: screen.colorDepth,
            pixelRatio: window.devicePixelRatio || 1
          },
          navigator: {
            userAgent: navigator.userAgent,
            language: navigator.language,
            hardwareConcurrency: navigator.hardwareConcurrency || null,
            deviceMemory: navigator.deviceMemory || null,
            platform: navigator.platform,
            maxTouchPoints: navigator.maxTouchPoints || 0,
            doNotTrack: navigator.doNotTrack || null
          },
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
      });
    }

    function sendClick(fingerprint) {
      var payload = JSON.stringify({
        ref_code: REF_CODE,
        fingerprint: fingerprint,
        timestamp: Date.now()
      });

      var blob = new Blob([payload], { type: 'application/json' });

      if (navigator.sendBeacon && navigator.sendBeacon(CLICK_URL, blob)) {
        return;
      }

      fetch(CLICK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        credentials: 'same-origin',
        keepalive: true
      }).catch(function () {});
    }

    function detectPlatform() {
      var ua = navigator.userAgent;
      if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
      if (/Android/.test(ua)) return 'android';
      return 'desktop';
    }

    function showDesktopUI() {
      var spinner = document.getElementById('spinner');
      var desktopBlock = document.getElementById('desktop-block');
      if (spinner) spinner.style.display = 'none';
      if (desktopBlock) desktopBlock.classList.add('visible');
    }

    function redirect(url) {
      window.location.href = url;
    }

    collectFingerprint().then(function (fingerprint) {
      sendClick(fingerprint);

      var platform = detectPlatform();

      setTimeout(function () {
        if (platform === 'ios') {
          redirect(APP_STORE_URL);
        } else if (platform === 'android') {
          redirect(GOOGLE_PLAY_URL);
        } else {
          showDesktopUI();
        }
      }, REDIRECT_DELAY);
    }).catch(function () {
      var platform = detectPlatform();

      setTimeout(function () {
        if (platform === 'ios') {
          redirect(APP_STORE_URL);
        } else if (platform === 'android') {
          redirect(GOOGLE_PLAY_URL);
        } else {
          showDesktopUI();
        }
      }, REDIRECT_DELAY);
    });
  })();
  </script>
</body>
</html>`;
}
