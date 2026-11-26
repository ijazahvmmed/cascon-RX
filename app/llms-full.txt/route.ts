import { GET as summary } from '../llms.txt/route';
import { projectProfiles } from '@/data/project-profiles';
import { insights } from '@/data/insights';
import { faqs } from '@/data/faqs';
export const dynamic = 'force-static';
export async function GET() {
  const text = await summary().text();
  const projects = projectProfiles.map(project => [
    '### ' + project.name, project.intro, project.context,
    ...project.scope.map(([label, description]) => '- ' + label + ': ' + description),
    ...(project.outcomes ?? []),
  ].join('\n')).join('\n\n');
  const guides = insights.map(article => [
    '### ' + article.title, article.summary,
    ...article.sections.flatMap(section => ['#### ' + section.title, ...section.paragraphs,
      ...(section.table?.rows.map(row => '- ' + row.join(' | ')) ?? []),
      ...(section.checks?.map(([label, description]) => '- ' + label + ': ' + description) ?? [])]),
  ].join('\n')).join('\n\n');
  return new Response(text + '\n## Project notes\n\n' + projects + '\n\n## Guide text\n\n' + guides + '\n' + '\n## Frequently asked questions\n\n' + faqs.map(f => `### ${f.question}\n${f.answer}`).join('\n\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
