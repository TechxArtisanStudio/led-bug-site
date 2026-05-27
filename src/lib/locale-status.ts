import localeStatus from '../i18n/locale-status.json';
import { defaultLocale, type Locale } from '../i18n/locales';

export function localeIsIndexed(locale: Locale): boolean {
  if (locale === defaultLocale) return true;
  const entry = localeStatus[locale as keyof typeof localeStatus];
  return entry?.qa_passed === true;
}

export function localeShouldNoindex(locale: Locale): boolean {
  return !localeIsIndexed(locale);
}
