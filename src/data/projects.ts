import enMessages from '../i18n/en/messages.json';
import { img } from '../lib/cdn';
import type { Locale } from '../i18n/locales';
import { defaultLocale } from '../i18n/locales';
import { getMessages, type Messages } from '../lib/i18n';

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
  gallery?: string[];
};

type ProjectItem = Messages['projects']['items'][number];

function hydrateProject(item: ProjectItem): Project {
  return {
    ...item,
    cover: img(`projects/${item.slug}/cover.webp`),
    gallery: 'gallery' in item && Array.isArray(item.gallery) ? item.gallery : undefined,
  };
}

export async function getProjects(locale: Locale = defaultLocale): Promise<Project[]> {
  const m = await getMessages(locale);
  return m.projects.items.map(hydrateProject);
}

/** Sync English list for static path generation at build time. */
export const projects: Project[] = enMessages.projects.items.map(hydrateProject);
