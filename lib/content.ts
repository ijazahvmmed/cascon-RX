import { projectSlugs } from '@/data/project-slugs';
import { allWorkCards } from '@/data/work';
import { projectId } from './links';
export function projectHref(name: string) {
  const slug = allWorkCards.find(project => project.name === name)?.slug ?? projectId(name);
  return projectSlugs.includes(slug) ? '/work/' + slug : '/work#' + slug;
}
