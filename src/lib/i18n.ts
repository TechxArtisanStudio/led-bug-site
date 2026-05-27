import type { Locale } from '../i18n/locales';
import { defaultLocale } from '../i18n/locales';

export type Messages = typeof import('../i18n/en/messages.json');

const cache = new Map<Locale, Messages>();

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Merge locale overrides onto English defaults so partial translations never crash pages. */
function deepMerge<T>(base: T, override: Partial<T>): T {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return (override ?? base) as T;
  }

  const result = { ...base } as T;
  for (const key of Object.keys(override) as (keyof T)[]) {
    const overrideValue = override[key];
    if (overrideValue === undefined) continue;

    const baseValue = base[key];
    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      result[key] = deepMerge(baseValue, overrideValue as Partial<typeof baseValue>);
    } else {
      result[key] = overrideValue as T[keyof T];
    }
  }

  return result;
}

async function loadEnglishMessages(): Promise<Messages> {
  return (await import('../i18n/en/messages.json')).default as Messages;
}

export async function getMessages(locale: Locale): Promise<Messages> {
  if (cache.has(locale)) return cache.get(locale)!;

  const en = await loadEnglishMessages();
  if (locale === defaultLocale) {
    cache.set(locale, en);
    return en;
  }

  const mod = await import(`../i18n/${locale}/messages.json`);
  const messages = deepMerge(en, mod.default as Partial<Messages>);
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
