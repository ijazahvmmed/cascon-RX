import { META_PIXEL_ID } from './constants';

export const FB_PIXEL_ID = META_PIXEL_ID;

type FbqEventParams = Record<string, string | number | boolean | undefined | null>;

declare global {
  interface Window {
    fbq?: {
      (action: 'init', pixelId: string): void;
      (action: 'track', eventName: string, params?: FbqEventParams): void;
      (action: 'trackCustom', eventName: string, params?: FbqEventParams): void;
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
    };
    _fbq?: unknown;
  }
}

// Track pageviews
export const pageview = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

// Track standard events (e.g. Lead, Contact, Schedule, ViewContent)
export const trackEvent = (name: string, options: FbqEventParams = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', name, options);
  }
};

// Track custom events
export const trackCustomEvent = (name: string, options: FbqEventParams = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', name, options);
  }
};
