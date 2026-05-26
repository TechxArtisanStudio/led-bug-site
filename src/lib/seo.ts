import { img } from './cdn';

export const SITE_URL = 'https://led-bug.com';
export const SITE_NAME = 'LED-Bug';
export const SITE_LOCALE = 'en_US';
export const DEFAULT_TITLE = 'LED-Bug — Creative LED Control';
export const DEFAULT_DESCRIPTION =
  'WLED · DMX512 · ESP32 LED controllers for gallery installations, makers, and artists. Explore projects, specs, and stories from TechxArtisan.';
export const DEFAULT_OG_IMAGE = img('branding/cover-en.webp');
export const TWITTER_HANDLE = '@TechxArtisan';

export type OgType = 'website' | 'article';

export type PageSeo = {
  title?: string;
  /** Shorter headline for Open Graph / Twitter (defaults to `title`). */
  socialTitle?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  type?: OgType;
  publishedTime?: Date;
  modifiedTime?: Date;
  authors?: string[];
  noindex?: boolean;
};

export function pageTitle(title?: string): string {
  if (!title || title === DEFAULT_TITLE) return DEFAULT_TITLE;
  return title.includes('LED-Bug') ? title : `${title} — LED-Bug`;
}

export function canonicalUrl(pathname: string): string {
  if (pathname === '/' || pathname === '') return `${SITE_URL}/`;
  const clean = pathname.replace(/\/$/, '');
  return `${SITE_URL}${clean}/`;
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: img('branding/logo-c-eng-white.svg'),
    sameAs: [
      'https://github.com/TechxArtisan',
      'https://youtube.com/@TechxArtisan',
      'https://techxartisan.com/en/',
      'https://twitter.com/TechxArtisan',
    ],
  };
}

export function webSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: { '@type': 'Organization', name: 'TechxArtisan' },
  };
}

export function articleJsonLd(opts: {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: Date;
  authors: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    image: opts.image,
    datePublished: opts.datePublished.toISOString(),
    author: opts.authors.map((name) => ({ '@type': 'Organization', name })),
    publisher: {
      '@type': 'Organization',
      name: 'TechxArtisan',
      logo: { '@type': 'ImageObject', url: img('branding/logo-c-eng-white.svg') },
    },
  };
}

export function creativeWorkJsonLd(opts: {
  title: string;
  description: string;
  url: string;
  image: string;
  artist?: string;
  year?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: opts.title,
    description: opts.description,
    url: opts.url,
    image: opts.image,
    ...(opts.artist && { creator: { '@type': 'Person', name: opts.artist } }),
    ...(opts.year && { dateCreated: `${opts.year}` }),
  };
}

export function productJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  image: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: opts.name,
    description: opts.description,
    url: opts.url,
    image: opts.image,
    brand: { '@type': 'Brand', name: SITE_NAME },
  };
}
