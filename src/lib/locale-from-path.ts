import { defaultLocale, isLocale, type Locale } from '../i18n/locales';

export function getLocaleFromPath(pathname: string): Locale {
  const segment = pathname.split('/').filter(Boolean)[0] ?? '';
  if (isLocale(segment) && segment !== defaultLocale) return segment;
  return defaultLocale;
}
