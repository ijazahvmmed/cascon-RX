'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { PostHog } from 'posthog-js';
import { sourceType } from '@/lib/analytics';

const GA_ID = 'G-HC2CS0B5GW';
const CLARITY_ID = 'zjqxftn53a';
const POSTHOG_KEY = 'phc_ov4QctEXN5hMymjvSUjGqdgZCENwacsrSoFYhvrSchDK';
const PREFERENCE = 'cascon:optional-analytics';
const PRODUCTION_HOST = 'www.cascondigital.com';

type Props = Record<string, string>;
type TrackingWindow = Window & {
  dataLayer?: IArguments[];
  gtag?: (...args: unknown[]) => void;
  clarity?: (command: string, status: Record<string, string>) => void;
  casconAnalyticsReady?: boolean;
};

export default function OptionalAnalytics() {
  const pathname = usePathname();
  const [production, setProduction] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);
  const [posthogReady, setPosthogReady] = useState(false);
  const posthog = useRef<PostHog | null>(null);
  const previousPath = useRef<string | null>(null);
  const previousPostHogPath = useRef<string | null>(null);
  const landing = useRef<{ path: string; source: string } | null>(null);

  useEffect(() => {
    if (location.hostname !== PRODUCTION_HOST) return;
    setProduction(true);
    try { setAllowed(localStorage.getItem(PREFERENCE) === 'yes'); } catch { /* Optional storage. */ }
  }, []);

  useEffect(() => {
    if (!allowed) return;
    const tracking = window as TrackingWindow;
    if (!tracking.casconAnalyticsReady) {
      tracking.dataLayer ??= [];
      // Google's queue uses the arguments object for gtag commands.
      // eslint-disable-next-line prefer-rest-params
      tracking.gtag = function () { tracking.dataLayer?.push(arguments); };
      tracking.gtag('consent', 'default', {
        analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
      });
      tracking.gtag('js', new Date());
      tracking.gtag('config', GA_ID, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
      tracking.casconAnalyticsReady = true;
    }

    let active = true;
    void import('posthog-js').then(({ default: sdk }) => {
      if (!active) return;
      sdk.init(POSTHOG_KEY, {
        api_host: 'https://us.i.posthog.com',
        autocapture: false,
        capture_pageview: false,
        capture_pageleave: false,
        capture_dead_clicks: false,
        disable_session_recording: true,
        disable_surveys: true,
        person_profiles: 'never',
        before_send: (event) => {
          if (!event?.properties) return event;
          for (const key of ['$current_url', '$referrer', '$initial_current_url', '$initial_referrer']) {
            const value: unknown = event.properties[key];
            if (typeof value !== 'string' || !/^https?:\/\//.test(value)) continue;
            const url = new URL(value);
            event.properties[key] = url.origin === location.origin ? url.origin + url.pathname : url.origin;
          }
          return event;
        },
      });
      posthog.current = sdk;
      setPosthogReady(true);
    }).catch(() => {});
    setReady(true);
    return () => { active = false; };
  }, [allowed]);

  useEffect(() => {
    if (!allowed || !ready || previousPath.current === pathname) return;
    const current = new URL(pathname, location.origin).href;
    landing.current ??= { path: pathname, source: sourceType(document.referrer, location.search) };
    (window as TrackingWindow).gtag?.('event', 'page_view', {
      page_location: current,
      page_referrer: previousPath.current ? new URL(previousPath.current, location.origin).href : '',
      source_type: landing.current.source,
    });
    previousPath.current = pathname;
  }, [allowed, pathname, ready]);

  useEffect(() => {
    if (!allowed || !posthogReady || previousPostHogPath.current === pathname) return;
    posthog.current?.capture('$pageview', {
      $current_url: new URL(pathname, location.origin).href,
      source_type: landing.current?.source ?? 'direct',
    });
    previousPostHogPath.current = pathname;
  }, [allowed, pathname, posthogReady]);

  useEffect(() => {
    if (!allowed || !ready) return;
    function trackIntent(event: Event) {
      const props = (event as CustomEvent<Props>).detail;
      (window as TrackingWindow).gtag?.('event', 'enquiry_intent', props);
      posthog.current?.capture('enquiry_intent', props, { send_instantly: true });
    }
    window.addEventListener('cascon:enquiry-intent', trackIntent);
    return () => window.removeEventListener('cascon:enquiry-intent', trackIntent);
  }, [allowed, ready]);

  function changePreference() {
    try { localStorage.setItem(PREFERENCE, allowed ? 'no' : 'yes'); } catch { return; }
    if (allowed) {
      posthog.current?.opt_out_capturing();
      (window as TrackingWindow).gtag?.('consent', 'update', { analytics_storage: 'denied' });
      (window as TrackingWindow).clarity?.('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' });
      location.reload();
      return;
    }
    setAllowed(true);
  }

  if (!production) return null;
  return <>
    <button type="button" onClick={changePreference} aria-pressed={allowed}>
      {allowed ? 'Turn off optional analytics' : 'Allow optional analytics and session replay'}
    </button>
    {allowed && ready && <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script src={`https://www.clarity.ms/tag/${CLARITY_ID}`} strategy="afterInteractive"
        onReady={() => (window as TrackingWindow).clarity?.('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' })} />
    </>}
  </>;
}
