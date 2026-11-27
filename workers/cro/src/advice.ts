import type { ScanReport } from '../../../lib/cro/model';

export const models = {
  granite: '@cf/ibm-granite/granite-4.0-h-micro',
  gpt: '@cf/openai/gpt-oss-20b',
} as const;
const followups = {
  product: 'Reopen the item as a shopper and check the change before adding it to the cart.',
  collection: 'Open the collection and follow an item link to check the change.',
  homepage: 'Start a fresh visit on the homepage and check the change there.',
  mobile: 'Try the updated page on a phone, including with larger text.',
} as const;
export function choices(report: ScanReport) {
  return report.recommendations.map(({id,page,category}) => ({id,page,category,allowed:
    category === 'mobile' ? ['mobile',page] : [page,'skip']}));
}
export function advicePrompt(rows: ReturnType<typeof choices>) {
  return [{role:'system' as const,content:'Select one follow-up key per observation, in order. Prefer mobile for mobile issues, otherwise the observed page. Return only a JSON array of allowed keys. Use skip if irrelevant.'},
    {role:'user' as const,content:JSON.stringify(rows)}];
}
export function applyAdvice(report: ScanReport, raw: string) {
  const selected:unknown = JSON.parse(raw);
  const rows = choices(report);
  if (!Array.isArray(selected) || selected.length !== rows.length ||
    !selected.every((key,i) => typeof key === 'string' && rows[i].allowed.includes(key))) return report;
  return {...report,recommendations:report.recommendations.map((finding,i) => selected[i] === 'skip' ? finding :
    {...finding,change:finding.change+' '+followups[selected[i] as keyof typeof followups]})};
}
export function completion(reply: unknown):string {
  const message = reply as {response?:string; choices?:{message?:{content?:string}}[]};
  return message.choices?.[0]?.message?.content ?? message.response ?? '';
}
export async function enhance(report: ScanReport, ai: Ai, model: keyof typeof models) {
  try {
    const reply = await ai.run(models[model],{messages:advicePrompt(choices(report)),max_tokens:160,temperature:0});
    return applyAdvice(report,completion(reply));
  } catch { /* The deterministic recommendation is complete on its own. */ }
  return report;
}
