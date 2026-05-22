export type Locale =
  | "en"
  | "ru"
  | "id"
  | "zh"
  | "es"
  | "ar"
  | "tr"
  | "pt"
  | "de"
  | "fr";

export interface Messages {
  subtitle: string;
  qrAlt: string;
  appStore: string;
  googlePlay: string;
  desktopHint: string;
  noscriptRedirect: string;
}

export const DEFAULT_LOCALE: Locale = "en";

export const SUPPORTED_LOCALES: Locale[] = [
  "en",
  "ru",
  "id",
  "zh",
  "es",
  "ar",
  "tr",
  "pt",
  "de",
  "fr",
];

export const translations: Record<Locale, Messages> = {
  en: {
    subtitle: "Opening Alton Trader...",
    qrAlt: "QR code to download Alton Trader",
    appStore: "Download on the App Store",
    googlePlay: "Get it on Google Play",
    desktopHint: "Scan the QR code or choose a store",
    noscriptRedirect: "JavaScript is disabled. Redirecting in 3 seconds...",
  },
  ru: {
    subtitle: "Открываем Alton Trader...",
    qrAlt: "QR-код для скачивания Alton Trader",
    appStore: "Скачать в App Store",
    googlePlay: "Скачать в Google Play",
    desktopHint: "Отсканируйте QR-код или выберите магазин",
    noscriptRedirect:
      "JavaScript отключён. Перенаправление через 3 секунды...",
  },
  id: {
    subtitle: "Membuka Alton Trader...",
    qrAlt: "Kode QR untuk mengunduh Alton Trader",
    appStore: "Unduh di App Store",
    googlePlay: "Unduh di Google Play",
    desktopHint: "Pindai kode QR atau pilih toko",
    noscriptRedirect:
      "JavaScript dinonaktifkan. Mengalihkan dalam 3 detik...",
  },
  zh: {
    subtitle: "正在打开 Alton Trader...",
    qrAlt: "下载 Alton Trader 的二维码",
    appStore: "在 App Store 下载",
    googlePlay: "在 Google Play 下载",
    desktopHint: "扫描二维码或选择应用商店",
    noscriptRedirect: "JavaScript 已禁用。3 秒后跳转...",
  },
  es: {
    subtitle: "Abriendo Alton Trader...",
    qrAlt: "Código QR para descargar Alton Trader",
    appStore: "Descargar en App Store",
    googlePlay: "Descargar en Google Play",
    desktopHint: "Escanea el código QR o elige una tienda",
    noscriptRedirect:
      "JavaScript desactivado. Redirigiendo en 3 segundos...",
  },
  ar: {
    subtitle: "جارٍ فتح Alton Trader...",
    qrAlt: "رمز QR لتنزيل Alton Trader",
    appStore: "تنزيل من App Store",
    googlePlay: "تنزيل من Google Play",
    desktopHint: "امسح رمز QR أو اختر المتجر",
    noscriptRedirect: "تم تعطيل JavaScript. إعادة التوجيه خلال 3 ثوانٍ...",
  },
  tr: {
    subtitle: "Alton Trader açılıyor...",
    qrAlt: "Alton Trader indirmek için QR kodu",
    appStore: "App Store'dan indir",
    googlePlay: "Google Play'den indir",
    desktopHint: "QR kodunu tarayın veya mağaza seçin",
    noscriptRedirect:
      "JavaScript devre dışı. 3 saniye içinde yönlendiriliyor...",
  },
  pt: {
    subtitle: "Abrindo Alton Trader...",
    qrAlt: "Código QR para baixar o Alton Trader",
    appStore: "Baixar na App Store",
    googlePlay: "Baixar no Google Play",
    desktopHint: "Escaneie o QR code ou escolha a loja",
    noscriptRedirect:
      "JavaScript desativado. Redirecionando em 3 segundos...",
  },
  de: {
    subtitle: "Alton Trader wird geöffnet...",
    qrAlt: "QR-Code zum Herunterladen von Alton Trader",
    appStore: "Im App Store laden",
    googlePlay: "Bei Google Play laden",
    desktopHint: "QR-Code scannen oder Store wählen",
    noscriptRedirect:
      "JavaScript ist deaktiviert. Weiterleitung in 3 Sekunden...",
  },
  fr: {
    subtitle: "Ouverture d'Alton Trader...",
    qrAlt: "Code QR pour télécharger Alton Trader",
    appStore: "Télécharger sur l'App Store",
    googlePlay: "Télécharger sur Google Play",
    desktopHint: "Scannez le QR code ou choisissez un store",
    noscriptRedirect:
      "JavaScript désactivé. Redirection dans 3 secondes...",
  },
};

function normalizeLanguageTag(tag: string): string {
  return tag.trim().toLowerCase().split(";")[0].split("-")[0];
}

function matchLocale(code: string): Locale | null {
  if ((SUPPORTED_LOCALES as string[]).includes(code)) {
    return code as Locale;
  }
  return null;
}

export function resolveLocaleFromTags(tags: string[]): Locale {
  for (const tag of tags) {
    const code = normalizeLanguageTag(tag);
    const locale = matchLocale(code);
    if (locale) return locale;
  }
  return DEFAULT_LOCALE;
}

export function resolveLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const tags = acceptLanguage
    .split(",")
    .map((part) => part.trim().split(";")[0])
    .filter(Boolean);

  return resolveLocaleFromTags(tags);
}

export function getMessages(locale: Locale): Messages {
  return translations[locale] ?? translations[DEFAULT_LOCALE];
}

export function translationsJson(): string {
  return JSON.stringify(translations);
}
