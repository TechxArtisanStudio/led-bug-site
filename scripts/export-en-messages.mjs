#!/usr/bin/env node
/**
 * Build src/i18n/en/messages.json from current English source strings.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function loadProjectItems() {
  const projectsTs = fs.readFileSync(path.join(ROOT, 'src/data/projects-source.ts'), 'utf8');
  const items = [];
  const blocks = projectsTs.split(/\n  \{\n    slug:/).slice(1);
  for (const block of blocks) {
    const slug = block.match(/^ '([^']+)'/)?.[1];
    const title = block.match(/title: '([^']+)'/)?.[1] || block.match(/title: "([^"]+)"/)?.[1];
    const tag = block.match(/tag: '([^']+)'/)?.[1];
    const accent = block.match(/accent: '([^']+)'/)?.[1];
    const summary = block.match(/summary:\s*\n\s*'([^']*(?:\\'[^']*)*)'/)?.[1]?.replace(/\\'/g, "'");
    const artist = block.match(/artist: '([^']+)'/)?.[1];
    const venue = block.match(/venue: '([^']+)'/)?.[1];
    const year = block.match(/year: (\d+)/)?.[1];
    const links = [];
    const linkRe = /label: '([^']+)',\s*\n\s*url: '([^']+)'/g;
    let m;
    while ((m = linkRe.exec(block))) links.push({ label: m[1], url: m[2] });
    const related = block.match(/related: \[([^\]]*)\]/)?.[1];
    const relatedSlugs = related ? [...related.matchAll(/'([^']+)'/g)].map((x) => x[1]) : undefined;
    const blogSeries = block.match(/blogSeries: '([^']+)'/)?.[1];
    const galleryEmpty = /gallery: \[\],/.test(block);
    items.push({
      slug,
      title,
      tag,
      accent,
      ...(summary && { summary }),
      ...(artist && { artist }),
      ...(venue && { venue }),
      ...(year && { year: Number(year) }),
      ...(blogSeries && { blogSeries }),
      ...(relatedSlugs?.length && { related: relatedSlugs }),
      ...(links.length && { links }),
      ...(galleryEmpty && { gallery: [] }),
    });
  }
  return items;
}

const projectItems = loadProjectItems();

const messages = {
  seo: {
    defaultTitle: 'LED-Bug — Creative LED Control',
    defaultDescription:
      'WLED · DMX512 · ESP32 LED controllers for gallery installations, makers, and artists. Explore projects, specs, and stories from TechxArtisan.',
    siteName: 'LED-Bug',
  },
  nav: {
    work: 'Work',
    products: 'Products',
    projects: 'Projects',
    blog: 'Blog',
    about: 'About',
    shop: 'Shop',
    menu: 'Menu',
    language: 'Language',
  },
  footer: {
    tagline: 'Creative LED control for installations and makers. A product by TechxArtisan.',
    connect: 'Connect',
    order: 'Order',
    shopNow: 'Shop now',
    cookieSettings: 'Cookie settings',
    contact: 'Contact',
    copyright: 'TechxArtisan · LED-Bug',
  },
  cookie: {
    title: 'Cookie preferences',
    description:
      'We use Google Analytics to collect anonymous usage data (page views and traffic sources). Is that OK?',
    accept: 'Yes',
    decline: 'No',
  },
  home: {
    heroImageAlt: 'Mechanical Tree — LED installation powered by LED-Bug controllers',
    tagline: 'WLED · DMX512 · ESP32',
    title: 'Creative LED control for installations & makers',
    subtitle:
      'From gallery-scale robotics to desk prototypes — one controller platform that runs WLED out of the box and opens up when you need custom code.',
    ctaWork: 'See our work',
    ctaProducts: 'Explore controllers',
    scrollToWork: 'Scroll to work',
    installationsLabel: 'Installations',
    installationsTitle: "What we've built",
    viewAllProjects: 'View all projects →',
    platformLabel: 'Platform',
    platformTitle: 'One controller platform',
    platformBody:
      'From gallery installations to desk prototypes — LED-Bug controllers run WLED out of the box and open up when you need custom code.',
    chips: ['WLED firmware', 'DMX512 + MAX485', 'ESP32 dev platform'],
    hardwareLabel: 'Hardware',
    hardwareTitle: 'Choose your controller',
    srName: 'LED-Bug SR',
    srBlurb: 'Installation-grade. 500–800 LEDs per channel. Dual outputs, DMX512, onboard mic.',
    srBullets: [
      'ESP32-WROOM · WLED pre-installed',
      '5V / 12V / 24V strip support',
      'MAX485 · DMX512 wall washers',
    ],
    srFullSpecs: 'Full specs →',
    srAlt: 'LED-Bug SR controller',
    miniName: 'LED-Bug Mini',
    miniBlurb: 'Compact controller for makers. Same WLED stack in a smaller footprint.',
    miniBullets: ['ESP32 · WLED firmware', 'Addressable RGB strips', 'Arduino / PlatformIO ready'],
    miniFullSpecs: 'Full specs →',
    miniAlt: 'LED-Bug Mini controller',
    blogLabel: 'From the blog',
    blogTitle: 'Stories & deep dives',
    viewAllBlog: 'View all →',
  },
  about: {
    title: 'About',
    metaDescription:
      'LED-Bug is a creative LED control platform by TechxArtisan — ESP32 controllers with WLED, DMX512, and custom firmware for installations and makers.',
    imageAlt: 'LED-Bug creative LED control by TechxArtisan',
    heading: 'About',
    body:
      'LED-Bug is a creative LED control platform by TechxArtisan. We build controllers for installations, makers, and artists working with light.',
  },
  projects: {
    indexTitle: 'Projects',
    metaDescription:
      'Gallery-scale and studio LED installations by TechxArtisan — interactive towers, kinetic sculptures, and custom firmware powered by LED-Bug controllers.',
    imageAlt: 'Coloured Towers interactive LED installation at The Bowes Museum',
    heading: 'Projects',
    intro: 'Installations powered by LED-Bug controllers and custom firmware.',
    backToAll: '← All projects',
    artist: 'Artist',
    venue: 'Venue',
    year: 'Year',
    related: 'Related projects',
    blogSeries: 'Blog series',
    externalLinks: 'Links',
    fallbackDescription: 'creative lighting installation by TechxArtisan.',
    readFullStory: 'Read the full story →',
    relatedWork: 'Related work',
    items: projectItems,
  },
  products: {
    back: '← Products',
    shopNow: 'Shop now',
    sr: {
      name: 'LED-Bug SR',
      metaDescription:
        'Installation-grade ESP32 LED controller with WLED pre-installed, dual strip outputs, DMX512 via MAX485, onboard microphone for music sync, and 5V/12V/24V strip support.',
      imageAlt: 'LED-Bug SR WLED and DMX512 LED controller',
      body: 'ESP32 light controller with WLED pre-installed, dual strip outputs, DMX512 via MAX485, and onboard microphone for music sync.',
    },
    mini: {
      name: 'LED-Bug Mini',
      metaDescription:
        'Compact ESP32 LED controller with WLED firmware for addressable RGB strips — ideal for desk builds, prototypes, and smaller installations.',
      imageAlt: 'LED-Bug Mini compact WLED LED controller',
      body: 'Compact ESP32 controller with WLED firmware for addressable RGB strips — ideal for desk builds and smaller installations.',
    },
  },
  blog: {
    indexTitle: 'Blog',
    metaDescription:
      'Stories from TechxArtisan installations — collaborations with artists, technical deep dives, and the LED technology behind gallery-scale work.',
    imageAlt: 'LED-Bug blog — installation stories and technical deep dives',
    label: 'Journal',
    heading: 'Blog',
    intro:
      'Stories behind our installations — collaborations, experiments, and the technology that powers them.',
    readMore: 'Read article',
    seriesPrev: 'Previous',
    seriesNext: 'Next',
    postFooterCta: 'Building with LED-Bug controllers?',
    exploreControllers: 'Explore controllers',
  },
};

const outDir = path.join(ROOT, 'src/i18n/en');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'messages.json'), `${JSON.stringify(messages, null, 2)}\n`, 'utf8');
console.log('Wrote', path.join(outDir, 'messages.json'), `(${projectItems.length} projects)`);
