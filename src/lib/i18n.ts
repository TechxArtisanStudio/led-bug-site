import type { Locale } from '../i18n/locales';
import { defaultLocale } from '../i18n/locales';

export type Messages = typeof import('../i18n/en/messages.json');

const cache = new Map<Locale, Messages>();

export async function getMessages(locale: Locale): Promise<Messages> {
  if (cache.has(locale)) return cache.get(locale)!;
  if (locale === defaultLocale) {
    const en = (await import('../i18n/en/messages.json')).default as Messages;
    cache.set(locale, en);
    return en;
  }
  const mod = await import(`../i18n/${locale}/messages.json`);
  const messages = mod.default as Messages;
  cache.set(locale, messages);
  return messages;
}

export function t(messages: Messages, key: string): string {
  const parts = key.split('.');
  let cur: unknown = messages;
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return key;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === 'string' ? cur : key;
}
