export const CDN = 'https://assets.led-bug.com';

export const img = (path: string) => `${CDN}/images/${path}`;
export const data = (path: string) => `${CDN}/data/${path}`;

export const ASSETS = {
  logo: img('branding/logo-c-eng-white.svg'),
  favicon: img('branding/favicon.webp'),
  heroVideo: data('home/hero.mp4'),
  heroPoster: img('projects/mechanical-tree/cover.webp'),
  sr: {
    hero: img('sr/sr-en.webp'),
    intros: [
      img('sr/sr_intro_1-en.webp'),
      img('sr/sr_intro_2-en.webp'),
      img('sr/sr_intro_3-en.webp'),
    ],
  },
  mini: {
    hero: img('mini/mini-en.webp'),
    intros: [
      img('mini/mini_intro_1-en.webp'),
      img('mini/mini_intro_2-en.webp'),
      img('mini/mini_intro_3-en.webp'),
    ],
  },
} as const;

export const SHOP_URL =
  'https://shop.techxartisan.com/products/led-bug-series-wled-led-controller-sr-mini';
