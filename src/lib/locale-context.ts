import type { Locale } from '../i18n/locales';
import { localePath } from '../i18n/locales';
import type { Messages } from './i18n';

export type LocaleContext = {
  locale: Locale;
  messages: Messages;
  lp: (path: string) => string;
};

export function createLocaleContext(locale: Locale, messages: Messages): LocaleContext {
  return {
    locale,
    messages,
    lp: (path: string) => localePath(locale, path),
  };
}
