import type { ScanReport } from '../../../lib/cro/model';

export function assessment(report: Pick<ScanReport, 'shopping'>) {
  const total = report.shopping.length;
  const passed = report.shopping.filter(item => item.result === 'Confirmed').length;
  const issues = report.shopping.filter(item => item.result === 'Needs attention').length;
  const open = total - passed - issues;
  const minimum = total ? Math.round(100 * passed / total) : 0;
  const maximum = total ? Math.round(100 * (passed + open) / total) : 100;
  const partial = open > 0 || !total;
  return {
    total, passed, issues, open, minimum, maximum, partial,
    label: !passed && !issues ? 'Confirmed points' : partial ? 'Shopping score so far' : 'Shopping score',
    value: minimum + '/100',
    detail: partial
      ? (maximum - minimum) + ' points still open. Possible score ' + minimum + '–' + maximum + '.'
      : passed + ' of ' + total + ' shopping questions confirmed.',
  };
}
