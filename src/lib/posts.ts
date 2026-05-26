import type { CollectionEntry } from 'astro:content';

export type PostEntry = CollectionEntry<'posts'>;

export function postSlug(post: PostEntry): string {
  return post.id.replace(/\.mdx?$/, '');
}

export function seriesNav(post: PostEntry, allPosts: PostEntry[]) {
  if (!post.data.series || !post.data.part) {
    return { prev: undefined, next: undefined };
  }

  const seriesPosts = allPosts
    .filter((p) => p.data.series === post.data.series)
    .sort((a, b) => (a.data.part ?? 0) - (b.data.part ?? 0));

  const idx = seriesPosts.findIndex((p) => p.id === post.id);
  const prev = idx > 0 ? seriesPosts[idx - 1] : undefined;
  const next = idx >= 0 && idx < seriesPosts.length - 1 ? seriesPosts[idx + 1] : undefined;

  return {
    prev: prev
      ? { slug: postSlug(prev), label: prev.data.subtitle }
      : undefined,
    next: next
      ? { slug: postSlug(next), label: next.data.subtitle }
      : undefined,
  };
}
