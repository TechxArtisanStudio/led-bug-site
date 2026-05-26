export const defaultLocale = 'en' as const;

export const locales = [
  'en',
  'zh-cn',
  'zh-tw',
  'zh-hk',
  'es',
  'fr',
  'ja',
  'it',
] as const;

export type Locale = (typeof locales)[number];

export const nonDefaultLocales = locales.filter((l) => l !== defaultLocale) as Exclude<
  Locale,
  typeof defaultLocale
>[];

export type LocaleMeta = {
  code: Locale;
  label: string;
  htmlLang: string;
  ogLocale: string;
};

export const localeMeta: Record<Locale, LocaleMeta> = {
  en: { code: 'en', label: 'English', htmlLang: 'en', ogLocale: 'en_US' },
  'zh-cn': { code: 'zh-cn', label: '简体中文', htmlLang: 'zh-CN', ogLocale: 'zh_CN' },
  'zh-tw': { code: 'zh-tw', label: '繁體中文（台灣）', htmlLang: 'zh-TW', ogLocale: 'zh_TW' },
  'zh-hk': { code: 'zh-hk', label: '繁體中文（香港）', htmlLang: 'zh-HK', ogLocale: 'zh_HK' },
  es: { code: 'es', label: 'Español', htmlLang: 'es', ogLocale: 'es_ES' },
  fr: { code: 'fr', label: 'Français', htmlLang: 'fr', ogLocale: 'fr_FR' },
  ja: { code: 'ja', label: '日本語', htmlLang: 'ja', ogLocale: 'ja_JP' },
  it: { code: 'it', label: 'Italiano', htmlLang: 'it', ogLocale: 'it_IT' },
};

/** LLM/OpenCC targets (no English). */
export const translationLocales = nonDefaultLocales;

/** OpenCC derived from zh-cn only. */
export const openccFromZhCnLocales = ['zh-tw', 'zh-hk'] as const;

/** LLM from English (excludes OpenCC locales). */
export const llmFromEnglishLocales = translationLocales.filter(
  (l) => !openccFromZhCnLocales.includes(l as (typeof openccFromZhCnLocales)[number]),
) as Exclude<Locale, typeof defaultLocale | 'zh-tw' | 'zh-hk'>[];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) return clean === '/' ? '/' : clean.replace(/\/$/, '') || '/';
  const suffix = clean === '/' ? '' : clean;
  return `/${locale}${suffix}`.replace(/\/$/, '') || `/${locale}`;
}

/** Path without locale prefix (e.g. `/zh-cn/blog` → `/blog`). */
export function stripLocalePath(pathname: string): string {
  const segment = pathname.split('/').filter(Boolean)[0] ?? '';
  if (isLocale(segment) && segment !== defaultLocale) {
    const rest = pathname.slice(segment.length + 1);
    return rest ? (rest.startsWith('/') ? rest : `/${rest}`) : '/';
  }
  return pathname || '/';
}
