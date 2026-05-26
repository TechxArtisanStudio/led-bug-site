/** Google Analytics 4 measurement ID (led-bug.com property). */
export const GA_MEASUREMENT_ID = 'G-TMRKP4D1K2';

export const CONSENT_STORAGE_KEY = 'led-bug-consent';

export type ConsentState = {
  analytics: boolean;
  ts: number;
};
