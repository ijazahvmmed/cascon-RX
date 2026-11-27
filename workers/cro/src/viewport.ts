export interface ViewportReading { width:number; headingInView:boolean|null }
export async function inspectWidths(browser:BrowserRun, document:string):Promise<ViewportReading[]> {
  // Render the downloaded page in a fresh context without credentials, remote assets or executable merchant code.
  const cleaned = await new HTMLRewriter().on('script,iframe,frame,object,embed,base,meta[http-equiv],link,svg,template',
    {element(el){el.remove();}}).transform(new Response(document)).text();
  if (!cleaned || cleaned.length>300000) return [];
  const html = '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; form-action \'none\'; base-uri \'none\'">'+cleaned;
  const observations:ViewportReading[]=[];
  for(const width of [390,1440]){
    if (observations.length) await new Promise(resolve=>setTimeout(resolve,10200));
    const height=width===390?844:900;
    const response=await browser.quickAction('scrape',{html,elements:[{selector:'h1:first-of-type'}],
      viewport:{width,height,isMobile:width===390,hasTouch:width===390},rejectRequestPattern:['.*'],
      setJavaScriptEnabled:false,gotoOptions:{timeout:3500},actionTimeout:2000});
    if(!response.ok) break;
    const data=await response.json<{result?:{results?:{width:number;height:number;left:number;top:number}[]}[]}>();
    const headings=data.result?.[0]?.results;
    observations.push({width,headingInView:headings?.length ? headings.some(h=>h.width>0&&h.height>0&&h.left<width&&h.left+h.width>0&&h.top<height&&h.top+h.height>0) : null});
  }
  return observations;
}
