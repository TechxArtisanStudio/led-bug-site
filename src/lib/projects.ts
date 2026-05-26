import { img } from './cdn';
import { projects, type Project } from '../data/projects';

const DEFAULT_GALLERY = ['01', '02', '03', '04', '05', '06'];

/** Gallery image URLs for a project (excludes cover; used in grid). */
export function projectGalleryImages(project: Project): string[] {
  if (project.gallery?.length) {
    return project.gallery;
  }
  return DEFAULT_GALLERY.map((n) => img(`projects/${project.slug}/${n}.webp`));
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function relatedProjects(project: Project): Project[] {
  if (!project.related?.length) return [];
  return project.related
    .map((slug) => getProject(slug))
    .filter((p): p is Project => p !== undefined);
}

export function blogSeriesUrl(series: string): string {
  return `/blog/${series}-part-1`;
}
