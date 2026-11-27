import { publicUrl, sampleUrl, type fetcher } from './target';

type ReadStore = ReturnType<typeof fetcher>;
interface Asset { url:URL; source:string; rank:number; kind:'css'|'image'; viewport?: 'mobile' | 'desktop' }

export async function prepareCapture(document:string, home:URL, read:ReadStore) {
  const candidates: Asset[] = [];
  function collect(el:Element, kind:Asset['kind']) {
    if (candidates.length >= 80) return;
    const source = el.getAttribute(kind === 'css' ? 'href' : 'src');
    const classes = el.getAttribute('class') || '';
    const viewport = /(?:-|_)mobile\b/i.test(classes) ? 'mobile' : /(?:-|_)desktop\b/i.test(classes) ? 'desktop' : undefined;
    if (!source) return;
    try {
      const url = publicUrl(source,home);
      if (url.protocol !== 'https:' || !sampleUrl(url.href,home) ||
          !(kind === 'css' ? /\.css$/i : /\.(?:png|jpe?g|webp)$/i).test(url.pathname) ||
          [...url.searchParams.keys()].some(key => !['ver','v','width','height'].includes(key))) return;
      const width = Number(url.searchParams.get('width'));
      if (kind === 'image' && url.pathname.startsWith('/cdn/shop/') && width > 800) {
        url.searchParams.set('width',viewport === 'mobile' ? '416' : '800');
      }
      const rank = kind === 'css' ? Number(/(?:theme|main|base|global|style)(?:\.min)?\.css$|\/themes\//i.test(url.pathname))
        : Number(el.getAttribute('fetchpriority') === 'high') * 4 + Number(/hero|banner|cover|slide__image/i.test(classes));
      candidates.push({url,source,kind,rank,viewport});
    } catch { /* Ignore external and unsupported destinations. */ }
  }
  const found = new HTMLRewriter().on('link[rel="stylesheet"][href]',{element:el=>collect(el,'css')})
    .on('img[src]',{element:el=>collect(el,'image')}).transform(new Response(document));
  await found.arrayBuffer();
  const ordered = candidates.sort((a,b) => b.rank - a.rank);
  const images = ordered.filter(asset => asset.kind === 'image');
  const firstImage = images[0];
  const alternate = firstImage?.viewport && images.find(asset => asset.viewport && asset.viewport !== firstImage.viewport);
  const selected = [...ordered.filter(asset => asset.kind === 'css').slice(0,2)];
  if (firstImage) selected.push(firstImage);
  if (alternate) selected.push(alternate);
  const loaded = new Map<string,string>();
  for (const asset of selected) {
    if (loaded.has(asset.source)) continue;
    try {
      const response = await read(asset.url,home,false,asset.kind);
      const bytes = new Uint8Array(await response.document.arrayBuffer());
      if (response.isPartial() || !bytes.length) continue;
      if (asset.kind === 'css') loaded.set(asset.source,new TextDecoder().decode(bytes).replace(/</g,'\\3c '));
      else {
        let binary = '';
        for (let i=0;i<bytes.length;i+=4096) binary += String.fromCharCode(...bytes.subarray(i,i+4096));
        loaded.set(asset.source,'data:'+response.document.headers.get('content-type')!.split(';')[0]+';base64,'+btoa(binary));
      }
    } catch { /* A missing asset leaves the saved page available to render. */ }
  }
  const styled = new HTMLRewriter().on('link[rel="stylesheet"]',{element(el) {
    const css = loaded.get(el.getAttribute('href') || '');
    if (!css || el.hasAttribute('disabled')) return;
    const media = el.getAttribute('media');
    if (media && !['all','screen'].includes(media.toLowerCase())) return;
    el.replace('<style>'+css+'</style>',{html:true});
  }}).on('img[src]', {element(el) {
    const src = loaded.get(el.getAttribute('src') || '');
    if (src) { el.removeAttribute('srcset'); el.setAttribute('loading','eager'); el.setAttribute('src',src); }
  }}).transform(new Response(document));
  return styled.text();
}

export interface ViewportReading {
  width: number;
  headingInView: boolean | null;
  screenshot?: string;
  missingVisibleImages?: boolean;
}

interface Snapshot {
  result?: {
    screenshot?: string;
    scrape?: { results?: { width:number; height:number; left:number; top:number }[] }[];
  };
}

export async function inspectWidths(browser: BrowserRun, document: string): Promise<ViewportReading[]> {
  const cleaned = await new HTMLRewriter()
    .on('script,iframe,frame,object,embed,base,meta[http-equiv],link,template,foreignObject,picture source', {
      element(el) { el.remove(); },
    }).transform(new Response(document)).text();
  if (!/<body[\s>]/i.test(cleaned) || cleaned.length > 1450000) return [];
  const html = '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; img-src data:; style-src \'unsafe-inline\'; form-action \'none\'; base-uri \'none\'">' + cleaned;
  const observations: ViewportReading[] = [];
  for (const width of [390,1440]) {
    if (observations.length) await new Promise(resolve => setTimeout(resolve, 10200));
    const height = width === 390 ? 844 : 900;
    try {
      const response = await browser.quickAction('snapshot', {
        html, formats:['screenshot','scrape'], elements:[
          {selector:'h1:first-of-type'},
          {selector:'img[src]:not([src^="data:"])'},
        ],
        screenshotOptions:{type:'jpeg',quality:60,fullPage:false},
        viewport:{width,height,isMobile:width === 390,hasTouch:width === 390},
        setJavaScriptEnabled:false, rejectRequestPattern:['.*'],
        gotoOptions:{timeout:3500,waitUntil:'load'}, waitForTimeout:1500, actionTimeout:3500,
      });
      if (!response.ok) break;
      const { result } = await response.json<Snapshot>();
      const headings = result?.scrape?.[0]?.results;
      const inViewport = ({width:elementWidth,height:elementHeight,left,top}: NonNullable<typeof headings>[number]) =>
        elementWidth > 0 && elementHeight > 0 && left < width && left + elementWidth > 0 &&
        top < height && top + elementHeight > 0;
      const headingInView = headings?.length ? headings.some(inViewport) : null;
      const missingVisibleImages = result?.scrape?.[1]?.results?.some(
        image => image.width >= 120 && image.height >= 100 && inViewport(image));
      const image = result?.screenshot;
      const screenshot = image && image.length < 320000 && image.startsWith('/9j/') &&
        /^[A-Za-z0-9+/]+={0,2}$/.test(image) ? image : undefined;
      observations.push({width,headingInView,screenshot,missingVisibleImages});
    } catch { break; }
  }
  return observations;
}
