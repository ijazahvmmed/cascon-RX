import type { PageKind, Sample } from '../../../lib/cro/model';
import { evaluate } from './evaluate';
import { extract, verifies } from './extract';
import type { DocumentEvidence } from './extract';
import { fetcher, Rejection, sampleUrl } from './target';

function stripSlash(path: string) { return path.replace(/\/$/, ''); }

function merchantStopped(sample?: Sample) {
  return sample?.status === 'blocked' || sample?.status === 'rate limited';
}

function requireRead(sample: Sample) {
  if (sample.status === 'read' || sample.status === 'partial') return;
  if (sample.status === 'blocked') throw new Rejection('denied');
  if (sample.status === 'rate limited') throw new Rejection('store-limited');
  if (sample.status === 'unavailable') throw new Rejection('unavailable');
  throw new Rejection('unsampled');
}

export async function scan(entry: URL, signal: AbortSignal, read = fetcher(signal), onRead?: (kind: PageKind, path: string) => void, captureHome?: (html:string)=>void, captureReview?: (evidence:unknown)=>void) {
  const root = new URL(entry.origin);
  onRead?.('homepage', root.pathname);
  const homeResponse = await read(root, root, true);
  const snapshot = captureHome ? homeResponse.document.clone() : undefined;
  const home = await extract(homeResponse.document, homeResponse.url, 'homepage');
  home.complete = !homeResponse.isPartial();
  if (home.blocked) throw new Rejection('denied');
  if (!verifies(home, 'homepage')) throw new Rejection('unverified');

  if (snapshot && captureHome && home.complete) captureHome(await snapshot.text());
  const samples: Sample[] = [{ kind: 'homepage', path: home.url.pathname, status: home.complete ? 'read' : 'partial' }];
  const tried = new Set([home.url.pathname]);
  const pages: Partial<Record<PageKind, DocumentEvidence>> = { homepage: home };
  async function sample(kind: 'product' | 'collection', sources: DocumentEvidence[], attempts: number, exactPath?: string) {
    const hits = sources.flatMap(doc => doc.candidates)
      .filter(hit => hit.kind === kind && (!exactPath || stripSlash(hit.path) === exactPath))
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
        onRead?.(kind, candidate.pathname);
        const response = await read(candidate, home.url);
        const page = await extract(response.document, response.url, kind);
        page.complete = !response.isPartial();
        const samePath = candidate.pathname.replace(/\/$/, '') === page.url.pathname.replace(/\/$/, '');
        if ((!exactPath || samePath) && verifies(page, kind, samePath)) {
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

  const requested = stripSlash(entry.pathname);
  let product: Sample | undefined;
  let collection: Sample | undefined;
  if (requested && requested !== stripSlash(home.url.pathname)) {
    const match = home.candidates.find(hit => stripSlash(hit.path) === requested);
    if (match?.kind === 'collection') {
      collection = await sample('collection', [home], 1, requested);
      if (!merchantStopped(collection)) requireRead(collection);
    } else {
      if (!match) {
        collection = await sample('collection', [home], 2);
        requireRead(collection);
      }
      product = await sample('product', pages.collection ? [pages.collection, home] : [home], 1, requested);
      if (!merchantStopped(product)) requireRead(product);
    }
  }

  product ??= merchantStopped(collection) ? { kind:'product', status:'skipped' }
    : await sample('product', pages.collection ? [pages.collection, home] : [home], 1);
  collection ??= merchantStopped(product)
    ? { kind: 'collection', status: 'skipped' }
    : await sample('collection', [home], 2);
  if (!pages.product && !merchantStopped(product) && pages.collection) {
    const retry = await sample('product', [pages.collection, home], 2);
    if (retry.status !== 'not found') product = retry;
  }
  samples.push(product, collection);
  if (signal.aborted && !pages.product && !pages.collection) {
    // The homepage is still valid evidence when deeper pages time out.
    for (const sample of samples) if (sample.status !== 'read' && sample.status !== 'partial' && !['blocked','rate limited','skipped','outside scope'].includes(sample.status)) sample.status = 'unavailable';
  }
  return evaluate(home, pages, samples, new Date().toISOString(),captureReview);
}
