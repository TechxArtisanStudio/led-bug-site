import type { CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/locales';
import { defaultLocale } from '../i18n/locales';

export type PostEntry = CollectionEntry<'posts'>;

const LOCALE_SUFFIX =
  /--(en|zh-cn|zh-tw|zh-hk|es|fr|ja|it)(?:\.(?:md|mdx))?$/;

export function postLocale(post: PostEntry): Locale {
  const m = post.id.match(LOCALE_SUFFIX);
  if (m) return m[1] as Locale;
  return defaultLocale;
}

export function postSlug(post: PostEntry): string {
  return post.id
    .replace(/\.mdx?$/, '')
    .replace(/--(en|zh-cn|zh-tw|zh-hk|es|fr|ja|it)$/, '');
}

export function postsForLocale(posts: PostEntry[], locale: Locale): PostEntry[] {
  return posts.filter((p) => postLocale(p) === locale);
}

export function seriesNav(post: PostEntry, allPosts: PostEntry[]) {
  if (!post.data.series || !post.data.part) {
    return { prev: undefined, next: undefined };
  }

  const locale = postLocale(post);
  const seriesPosts = allPosts
    .filter((p) => postLocale(p) === locale && p.data.series === post.data.series)
    .sort((a, b) => (a.data.part ?? 0) - (b.data.part ?? 0));

  const idx = seriesPosts.findIndex((p) => p.id === post.id);
  const prev = idx > 0 ? seriesPosts[idx - 1] : undefined;
  const next = idx >= 0 && idx < seriesPosts.length - 1 ? seriesPosts[idx + 1] : undefined;

  return {
    prev: prev ? { slug: postSlug(prev), label: prev.data.subtitle } : undefined,
    next: next ? { slug: postSlug(next), label: next.data.subtitle } : undefined,
  };
}
