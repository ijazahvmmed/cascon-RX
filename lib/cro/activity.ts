export const CRO_ACTIVITY = 'cascon:cro-activity';

export type CroActivity =
  | { name: 'cro_scan_complete'; coverage: 'scored' | 'partial'; sampled: string }
  | { name: 'cro_recommendation_engagement'; rule: string }
  | { name: 'enquiry_intent'; channel: 'calendar'; tool: 'cro-audit' };

export function trackCro(activity: CroActivity) {
  window.dispatchEvent(new CustomEvent(CRO_ACTIVITY, { detail: activity }));
}
