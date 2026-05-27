import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';
import type { VFile } from 'vfile';
import {
  defaultLocale,
  isLocale,
  localePath,
  stripLocalePath,
  type Locale,
} from '../i18n/locales';

const LOCALE_SUFFIX =
  /--(en|zh-cn|zh-tw|zh-hk|es|fr|ja|it)(?:\.(?:md|mdx))?$/;

/** Site sections that use locale-prefixed routes for non-default locales. */
const INTERNAL_PATH =
  /^\/(blog|projects|products|about)(\/|$)/;

function resolveLocale(file: VFile): Locale {
  const fm = file.data?.astro?.frontmatter as { locale?: string } | undefined;
  if (fm?.locale && isLocale(fm.locale)) return fm.locale;

  const path = file.path ?? file.history?.[0] ?? '';
  const m = path.match(LOCALE_SUFFIX);
  if (m && isLocale(m[1])) return m[1];

  return defaultLocale;
}

function hrefString(href: unknown): string | undefined {
  if (typeof href === 'string') return href;
  return undefined;
}

function shouldRewrite(href: string): boolean {
  if (!href.startsWith('/')) return false;
  if (href.startsWith('//')) return false;
  return INTERNAL_PATH.test(stripLocalePath(href));
}

/** Prefix internal markdown links with the post locale (from frontmatter or filename). */
export function rehypeLocaleLinks() {
  return (tree: Root, file: VFile) => {
    const locale = resolveLocale(file);

    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'a') return;

      const raw = hrefString(node.properties?.href);
      if (!raw || !shouldRewrite(raw)) return;

      node.properties = node.properties ?? {};
      node.properties.href = localePath(locale, stripLocalePath(raw));
    });
  };
}
