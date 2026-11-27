import { Miniflare } from 'miniflare';
import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';

const [input, output] = process.argv.slice(2);
if (!input || !output) throw new Error('Supply a cohort JSON file and a results path.');
const hosts = JSON.parse(await readFile(input, 'utf8'));
const source = `
  import { scan } from './src/scan';
  import { storeEntry } from './src/target';
  export default {
    async fetch(request) {
      try {
        const store = storeEntry(await request.text());
        return Response.json(await scan(store, AbortSignal.timeout(17000)));
      } catch (error) {
        return Response.json({error: error.code ?? 'unavailable'});
      }
    }
  };
`;
const bundle = await build({
  stdin: { contents: source, resolveDir: process.cwd() },
  format: 'esm', bundle: true, write: false,
});
const runtime = new Miniflare({ workers: [{ config: {
  name: 'cohort', compatibilityDate: '2026-11-24',
  manifest: {
    mainModule: 'index.js', modulesRoot: process.cwd(),
    modules: {'index.js': {type: 'esm', contents: bundle.outputFiles[0].text}},
  },
} }] });
const results = new Array(hosts.length);
let next = 0;
async function runStores() {
  while (next < hosts.length) {
    const index = next++;
    const host = hosts[index];
    const start = Date.now();
    const response = await runtime.dispatchFetch('http://bench.test/', {method: 'POST', body: host});
    const report = await response.json();
    results[index] = {
      host, ms: Date.now() - start, error: report.error,
      assessed: report.score && report.score.total - report.score.open,
      pages: report.samples?.map(sample => sample.status),
      recommendations: report.recommendations?.length,
    };
  }
}
try {
  await Promise.all(Array.from({length: 3}, runStores));
  await writeFile(output, JSON.stringify(results, null, 2));
} finally {
  await runtime.dispose();
}
