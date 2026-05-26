import { visit } from 'unist-util-visit';
import type { Root, Element, ElementContent } from 'hast';

/** Known dimensions for layout hints (width × height). */
const IMAGE_DIMS: Record<string, [number, number]> = {
  'part-1-dave-bramston-artworks': [780, 265],
  'part-1-video-meeting-dave-bramston': [1599, 655],
  'part-1-concept-design-draft': [1241, 608],
  'part-1-led-controller-uk-flag-case': [1050, 392],
  'part-1-light-stands-development': [709, 533],
  'part-1-light-tower-design': [1147, 614],
  'part-1-studio-final-test-01': [1600, 1200],
  'part-1-studio-final-test-02': [1600, 1066],
  'part-1-remote-installation-kickoff': [934, 610],
  'part-1-museum-installing-led-strips': [872, 602],
  'part-1-installation-team-photo': [1080, 1440],
  'part-1-journey-in-colour-exhibition-01': [860, 534],
  'part-1-journey-in-colour-exhibition-02': [759, 581],
  'part-2-technical-process-diagram': [1279, 646],
  'part-2-colour-checker-board': [924, 314],
  'part-2-colour-detection-testing': [303, 405],
  'part-2-power-supply-connection': [1050, 501],
};

function isWhitespaceText(node: ElementContent): boolean {
  return node.type === 'text' && /^\s*$/.test(node.value);
}

function skipWhitespace(children: ElementContent[], start: number): number {
  let i = start;
  while (i < children.length && isWhitespaceText(children[i])) i++;
  return i;
}

function imgsInParagraph(node: Element): Element[] {
  return node.children.filter(
    (c) => c.type === 'element' && c.tagName === 'img'
  ) as Element[];
}

function isImageParagraph(node: Element): boolean {
  if (node.tagName !== 'p') return false;
  const imgs = imgsInParagraph(node);
  if (imgs.length === 0) return false;
  return node.children.every(
    (c) =>
      isWhitespaceText(c) ||
      (c.type === 'element' && c.tagName === 'img')
  );
}

function isCaptionParagraph(node: Element): boolean {
  if (node.tagName !== 'p' || node.children.length !== 1) return false;
  const child = node.children[0];
  return child.type === 'element' && child.tagName === 'em';
}

function captionText(node: Element): string {
  const em = node.children[0] as Element;
  return em.children
    .filter((c) => c.type === 'text')
    .map((c) => (c as { value: string }).value)
    .join('');
}

function imgSrc(img: Element): string {
  const src = img.properties?.src;
  return typeof src === 'string' ? src : '';
}

function imageKey(src: string): string {
  const file = src.split('/').pop() ?? '';
  return file.replace(/\.(webp|jpe?g|png)$/i, '');
}

function figureSizeModifier(src: string): string {
  const key = imageKey(src);
  const dims = IMAGE_DIMS[key];
  if (!dims) return 'post-figure--landscape';

  const [w, h] = dims;
  const ratio = w / h;

  if (ratio < 0.85) return 'post-figure--portrait';
  if (ratio > 2.7) return 'post-figure--banner';
  if (ratio > 1.55) return 'post-figure--landscape-wide';
  return 'post-figure--landscape';
}

function enrichImg(img: Element): Element {
  const src = imgSrc(img);
  const key = imageKey(src);
  const dims = IMAGE_DIMS[key];

  return {
    ...img,
    properties: {
      ...img.properties,
      className: ['post-figure-img'],
      loading: 'lazy',
      decoding: 'async',
      ...(dims ? { width: dims[0], height: dims[1] } : {}),
    },
  };
}

function makeFigure(images: Element[], caption?: string): Element {
  const isGrid = images.length >= 2;
  const modifier = isGrid
    ? 'post-figure--wide'
    : figureSizeModifier(imgSrc(images[0]));

  const figure: Element = {
    type: 'element',
    tagName: 'figure',
    properties: {
      className: ['post-figure', modifier],
    },
    children: [],
  };

  if (isGrid) {
    figure.children.push({
      type: 'element',
      tagName: 'div',
      properties: { className: ['post-figure-grid'] },
      children: images.map((img) => ({
        type: 'element',
        tagName: 'div',
        properties: { className: ['post-figure-cell'] },
        children: [enrichImg(img)],
      })),
    });
  } else {
    figure.children.push({
      type: 'element',
      tagName: 'div',
      properties: { className: ['post-figure-media'] },
      children: [enrichImg(images[0])],
    });
  }

  if (caption) {
    figure.children.push({
      type: 'element',
      tagName: 'figcaption',
      properties: { className: ['post-figure-caption'] },
      children: [{ type: 'text', value: caption }],
    });
  }

  return figure;
}

/** Wrap img + optional italic caption into figure elements; group consecutive image pairs. */
export function rehypeFigures() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (!parent || index === undefined || !isImageParagraph(node)) return;

      const images: Element[] = [...imgsInParagraph(node)];
      let endIndex = index + 1;

      while (true) {
        const nextIdx = skipWhitespace(parent.children, endIndex);
        if (nextIdx >= parent.children.length) break;
        const sibling = parent.children[nextIdx];
        if (sibling.type !== 'element' || !isImageParagraph(sibling as Element)) break;
        images.push(...imgsInParagraph(sibling as Element));
        endIndex = nextIdx + 1;
      }

      let caption: string | undefined;
      const capIdx = skipWhitespace(parent.children, endIndex);
      if (capIdx < parent.children.length && isCaptionParagraph(parent.children[capIdx] as Element)) {
        caption = captionText(parent.children[capIdx] as Element);
        endIndex = capIdx + 1;
      }

      const figure = makeFigure(images, caption);
      parent.children.splice(index, endIndex - index, figure as ElementContent);
      return index;
    });
  };
}
