import type { PageKind, Sample } from '../../../lib/cro/model';
import { evaluate } from './evaluate';
import { extract, verifies } from './extract';
import type { DocumentEvidence } from './extract';
import { fetcher, Rejection, sampleUrl } from './target';

export async function scan(entry: URL, signal: AbortSignal, read = fetcher(signal)) {
  const homeResponse = await read(entry, entry, true);
  const home = await extract(homeResponse.document, homeResponse.url);
  home.complete = !homeResponse.isPartial();
  if (home.blocked) throw new Rejection('denied');
  if (!verifies(home, 'homepage')) throw new Rejection('unverified');

  const samples: Sample[] = [{ kind: 'homepage', path: home.url.pathname, status: home.complete ? 'read' : 'partial' }];
  const tried = new Set([home.url.pathname]);
  const pages: Partial<Record<PageKind, DocumentEvidence>> = { homepage: home };
  async function sample(kind: 'product' | 'collection', sources: DocumentEvidence[], attempts: number) {
    const hits = sources.flatMap(doc => doc.candidates)
      .filter(hit => hit.kind === kind)
      .sort((a,b) => b.quality - a.quality);
    let status: Sample['status'] = 'not found';
    let attemptedPath: string | undefined;
    for (const hit of hits) {
      const candidate = sampleUrl(hit.path, home.url);
      if (!candidate || tried.has(candidate.pathname)) continue;
      if (attempts-- <= 0 || signal.aborted) break;
      attemptedPath = candidate.pathname;
      tried.add(candidate.pathname);
      try {
        const response = await read(candidate, home.url);
        const page = await extract(response.document, response.url);
        page.complete = !response.isPartial();
        const samePath = candidate.pathname.replace(/\/$/, '') === page.url.pathname.replace(/\/$/, '');
        if (verifies(page, kind, samePath)) {
          pages[kind] = page;
          return { kind, path: page.url.pathname, status: page.complete ? 'read' : 'partial' } satisfies Sample;
        }
        status = page.blocked ? 'blocked' : 'unverified';
      } catch (error) {
        const code = error instanceof Rejection ? error.code : 'unavailable';
        if (code === 'store-limited') status = 'rate limited';
        else if (code === 'denied') status = 'blocked';
        else if (code === 'blocked' || code === 'invalid') status = 'outside scope';
        else status = 'unavailable';
      }
      if (status === 'blocked' || status === 'rate limited') break;
    }
    return { kind, status, path: attemptedPath } satisfies Sample;
  }

  const product = await sample('product', [home], 1);
  const collection: Sample = product.status === 'blocked' || product.status === 'rate limited'
    ? { kind: 'collection', status: 'skipped' }
    : await sample('collection', [home], 2);
  samples.push(!pages.product && product.status !== 'blocked' && pages.collection ?
    await sample('product', [pages.collection, home], 2).then(found =>
      found.status === 'not found' ? product : found) : product,
  collection);
  if (signal.aborted && !pages.product && !pages.collection) {
    // The homepage is still valid evidence when deeper pages time out.
    for (const sample of samples) if (sample.status !== 'read' && sample.status !== 'partial' && !['blocked','rate limited','skipped','outside scope'].includes(sample.status)) sample.status = 'unavailable';
  }
  return evaluate(home, pages, samples, new Date().toISOString());
}
