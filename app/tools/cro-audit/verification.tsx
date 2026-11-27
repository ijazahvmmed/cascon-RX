'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
type Widget = {
  render(el:HTMLElement, options:Record<string,unknown>):string;
  remove(id:string):void;
};
export default function Verification({sitekey,onToken}:{sitekey:string;onToken:(value:string)=>void}) {
  const element = useRef<HTMLDivElement>(null);
  const [ready,setReady] = useState(false);
  useEffect(() => {
    const api = (window as Window & {turnstile?:Widget}).turnstile;
    if (!api || !ready || !element.current) return;
    const clear = () => onToken('');
    const id = api.render(element.current,{sitekey,action:'cro_scan',callback:onToken,'expired-callback':clear,'error-callback':clear});
    return () => { api.remove(id); };
  },[sitekey,onToken,ready]);
  return <><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={()=>setReady(true)} />
    <div ref={element} aria-label="Visitor verification" /></>;
}
