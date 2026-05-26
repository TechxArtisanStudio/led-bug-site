import { img } from '../lib/cdn';

export type ProjectLink = {
  label: string;
  url: string;
};

export type Project = {
  slug: string;
  title: string;
  tag: string;
  accent: string;
  cover: string;
  summary?: string;
  artist?: string;
  venue?: string;
  year?: number;
  blogSeries?: string;
  related?: string[];
  links?: ProjectLink[];
  /** Override default 01–06 gallery paths (full CDN URLs). */
  gallery?: string[];
};

export const projects: Project[] = [
  {
    slug: 'coloured-towers',
    title: 'Coloured Towers',
    tag: 'Interactive',
    accent: '#f97316',
    cover: img('projects/coloured-towers/cover.webp'),
    summary:
      'Four five-metre pillars of light that read the colours of visitors’ clothing and mirror them in LED — an interactive installation for Dave Bramston’s Journey in Colour at The Bowes Museum.',
    artist: 'Dave Bramston',
    venue: 'The Bowes Museum, UK',
    year: 2022,
    blogSeries: 'coloured-towers',
    related: ['moon-river', 'spectrum-of-objects'],
    links: [
      {
        label: 'Museum showcase (YouTube)',
        url: 'https://youtube.com/shorts/KyrteRpLcpw',
      },
      {
        label: 'Behind the scenes (YouTube)',
        url: 'https://youtube.com/shorts/uxvQTEgr8fY',
      },
      {
        label: 'Journey in Colour exhibition',
        url: 'https://thebowesmuseum.org.uk/exhibitions/journey-in-colour/',
      },
      {
        label: 'Dave Bramston',
        url: 'https://x.com/davidbramston',
      },
    ],
  },
  {
    slug: 'mechanical-tree',
    title: 'Mechanical Tree',
    tag: 'Robotics',
    accent: '#00e5ff',
    cover: img('projects/mechanical-tree/cover.webp'),
    summary:
      'A kinetic “mechanical tree” installation combining motion, light, and custom control — built with TechxArtisan’s LED and firmware stack.',
    artist: 'TechxArtisan',
    year: 2024,
    related: ['the-first-law-of-forest', 'led-bug-demos'],
  },
  {
    slug: 'moon-river',
    title: 'Moon River',
    tag: 'River',
    accent: '#3b82f6',
    cover: img('projects/moon-river/cover.webp'),
    summary:
      'A light installation reflecting Hakka culture through regeneration and repurposing, installed in ancient Hakka houses in Shenzhen with Dave Bramston and SUSTech School of Design.',
    artist: 'Dave Bramston',
    venue: 'Shenzhen, China',
    related: ['coloured-towers', 'spectrum-of-objects'],
  },
  {
    slug: 'spectrum-of-objects',
    title: 'Spectrum of Objects',
    tag: 'Spectrum',
    accent: '#a855f7',
    cover: img('projects/spectrum-of-objects/cover.webp'),
    summary:
      'Dave Bramston’s solo exhibition of seven collaborative works — factory leftovers from the Pearl River Delta transformed through light and interaction into a spectrum of forms and colours.',
    artist: 'Dave Bramston',
    related: ['coloured-towers', 'moon-river'],
  },
  {
    slug: 'magic-cube-lamp',
    title: 'Magic Cube Lamp',
    tag: 'Cube',
    accent: '#ef4444',
    cover: img('projects/magic-cube-lamp/cover.webp'),
    summary:
      'A compact, programmable cube lamp showcasing LED-Bug control — colour, motion, and patterns in a product-ready form factor.',
    artist: 'TechxArtisan',
    related: ['led-bug-demos'],
  },
  {
    slug: 'led-bug-demos',
    title: 'LED-Bug Demos',
    tag: 'Product',
    accent: '#22d3ee',
    cover: img('projects/led-bug-demos/cover.webp'),
    summary:
      'Live demonstrations of LED-Bug controllers — WLED, DMX512, and ESP32 firmware for installations, makers, and artists working with light.',
    artist: 'TechxArtisan',
    related: ['mechanical-tree', 'magic-cube-lamp'],
  },
  {
    slug: 'dreammech-forest',
    title: 'DreamMech Forest',
    tag: 'Outdoor',
    accent: '#22c55e',
    cover: img('projects/dreammech-forest/cover.webp'),
    summary:
      'An outdoor installation in Hefei: metal trees with mechanical flowers driven by N20 motors, RGB LED strips, and WiFi-synchronized control across 20–30 blooms.',
    artist: 'TechxArtisan',
    venue: 'Hefei, China',
    gallery: [],
  },
  {
    slug: 'the-first-law-of-forest',
    title: 'The First Law of Forest',
    tag: 'Installation',
    accent: '#84cc16',
    cover: img('projects/the-first-law-of-forest/cover.webp'),
    summary:
      'Chen Baoyang’s installation on humans, machines, and technology — AI, a robot arm, smoke, and spotlights around the metaphor of a “mechanical tree” and the “forest law.”',
    artist: 'Chen Baoyang',
    related: ['mechanical-tree', 'congrats-x'],
    gallery: [],
  },
  {
    slug: 'congrats-x',
    title: 'Congrats X, the Y is in another Z',
    tag: 'Autonomous',
    accent: '#eab308',
    cover: img('projects/congrats-x/cover.webp'),
    summary:
      'An AI-driven autonomous car that navigates a randomly generated maze, resets at each exit, and generates a new maze — a collaboration with Chen Baoyang (CAFA) and TechxArtisan.',
    artist: 'Chen Baoyang',
    related: ['the-first-law-of-forest'],
    gallery: [],
  },
  {
    slug: 'hello-5g-light',
    title: 'Hello 5G Light',
    tag: 'Anamorphic',
    accent: '#06b6d4',
    cover: img('projects/hello-5g-light/cover.webp'),
    summary:
      'Ninety-one LED tubes arranged so that, from a specific viewpoint four metres away, the installation reads “Hello 5G” — with preset and custom colour programs for different occasions.',
    gallery: [],
  },
  {
    slug: 'relationship',
    title: 'Relationship',
    tag: 'Kinetic',
    accent: '#e879f9',
    cover: img('projects/relationship/cover.webp'),
    summary:
      'With Wang Yuyang: over 300 white LED tubes on motors at both ends, moving in random and patterned rhythms — lights meeting and parting as a metaphor for human connection.',
    artist: 'Wang Yuyang',
    gallery: [],
  },
  {
    slug: 'platos-cube',
    title: "Plato's Cube",
    tag: 'Kinetic',
    accent: '#f472b6',
    cover: img('projects/platos-cube/cover.webp'),
    summary:
      'Wang Yuyang’s morphing polyhedron: twelve white LED tubes joined by transparent joints, twisting and compressing under program control so the form never repeats.',
    artist: 'Wang Yuyang',
    related: ['relationship'],
    gallery: [],
  },
];
