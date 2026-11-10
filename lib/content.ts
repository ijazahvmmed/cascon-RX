import { projectSlugs } from '@/data/project-slugs';
import { projectId } from './links';
export function projectHref(name: string) {
  const slug = projectId(name);
  return projectSlugs.includes(slug) ? '/work/' + slug : '/work#' + slug;
}
