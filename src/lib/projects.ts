import { img } from './cdn';
import { getProjects, projects, type Project } from '../data/projects';
import type { Locale } from '../i18n/locales';
import { defaultLocale, localePath } from '../i18n/locales';

const DEFAULT_GALLERY = ['01', '02', '03', '04', '05', '06'];

export function projectGalleryImages(project: Project): string[] {
  if (project.gallery?.length) {
    return project.gallery;
  }
  return DEFAULT_GALLERY.map((n) => img(`projects/${project.slug}/${n}.webp`));
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export async function getProjectForLocale(
  slug: string,
  locale: Locale,
): Promise<Project | undefined> {
  const list = await getProjects(locale);
  return list.find((p) => p.slug === slug);
}

export function relatedProjects(project: Project, locale: Locale = defaultLocale): Project[] {
  if (!project.related?.length) return [];
  return project.related
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is Project => p !== undefined);
}

export async function relatedProjectsForLocale(
  project: Project,
  locale: Locale,
): Promise<Project[]> {
  if (!project.related?.length) return [];
  const list = await getProjects(locale);
  return project.related
    .map((slug) => list.find((p) => p.slug === slug))
    .filter((p): p is Project => p !== undefined);
}

export function blogSeriesUrl(series: string, locale: Locale = defaultLocale): string {
  return localePath(locale, `/blog/${series}-part-1`);
}
