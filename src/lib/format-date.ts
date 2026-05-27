import { localeMeta, type Locale } from '../i18n/locales';

export function formatBlogDate(
  date: Date,
  locale: Locale,
  style: 'long' | 'short' = 'long',
): string {
  const { htmlLang } = localeMeta[locale];
  return date.toLocaleDateString(htmlLang, {
    year: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    day: 'numeric',
  });
}
