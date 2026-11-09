import { GET as summary } from '../llms.txt/route';
import { faqs } from '@/data/faqs';
export const dynamic = 'force-static';
export async function GET() {
  const text = await summary().text();
  return new Response(text + '\n## Frequently asked questions\n\n' + faqs.map(f => `### ${f.question}\n${f.answer}`).join('\n\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
