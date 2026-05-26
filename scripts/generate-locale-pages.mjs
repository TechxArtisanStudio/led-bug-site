#!/usr/bin/env node
/** Generate src/pages/[locale]/* wrappers for non-English locales. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LOCALE_PAGES = path.join(ROOT, 'src/pages/[locale]');

const files = {
  'index.astro': `---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Hero from '../../components/home/Hero.astro';
import InstallationShowcase from '../../components/home/InstallationShowcase.astro';
import PlatformBridge from '../../components/home/PlatformBridge.astro';
import ProductDual from '../../components/home/ProductDual.astro';
import BlogPreview from '../../components/home/BlogPreview.astro';
import { ASSETS } from '../../lib/cdn';
import { getMessages } from '../../lib/i18n';
import { nonDefaultLocales, type Locale } from '../../i18n/locales';
import { isLocale } from '../../i18n/locales';

export function getStaticPaths() {
  return nonDefaultLocales.map((locale) => ({ params: { locale }, props: { locale } }));
}

const { locale } = Astro.props as { locale: Locale };
if (!isLocale(locale)) throw new Error('invalid locale');
const m = await getMessages(locale);
---

<BaseLayout
  locale={locale}
  image={ASSETS.heroPoster}
  imageAlt={m.home.heroImageAlt}
>
  <Hero />
  <InstallationShowcase />
  <PlatformBridge />
  <BlogPreview />
  <ProductDual />
</BaseLayout>
`,
  'about.astro': `---
import BaseLayout from '../../layouts/BaseLayout.astro';
import PageSection from '../../components/PageSection.astro';
import { img } from '../../lib/cdn';
import { getMessages } from '../../lib/i18n';
import { nonDefaultLocales, type Locale } from '../../i18n/locales';
import { isLocale } from '../../i18n/locales';

export function getStaticPaths() {
  return nonDefaultLocales.map((locale) => ({ params: { locale }, props: { locale } }));
}

const { locale } = Astro.props as { locale: Locale };
const m = await getMessages(locale);
const a = m.about;
---

<BaseLayout
  locale={locale}
  title={a.title}
  description={a.metaDescription}
  image={img('branding/cover-en.webp')}
  imageAlt={a.imageAlt}
>
  <PageSection>
    <div class="max-w-2xl">
      <h1 class="text-4xl font-bold text-white">{a.heading}</h1>
      <p class="mt-6 leading-relaxed text-white/65">{a.body}</p>
      <ul class="mt-8 space-y-3 text-white/70">
        <li>
          <a href="https://github.com/TechxArtisan" class="hover:text-cyan-400" target="_blank" rel="noopener">GitHub</a>
        </li>
        <li>
          <a href="https://youtube.com/@TechxArtisan" class="hover:text-cyan-400" target="_blank" rel="noopener">YouTube</a>
        </li>
      </ul>
    </div>
  </PageSection>
</BaseLayout>
`,
};

fs.mkdirSync(LOCALE_PAGES, { recursive: true });
for (const [name, body] of Object.entries(files)) {
  fs.writeFileSync(path.join(LOCALE_PAGES, name), body, 'utf8');
}
console.log('Wrote locale pages:', Object.keys(files).join(', '));
