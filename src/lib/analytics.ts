export type AnalyticsProperty = string | number | boolean | null | undefined;
export type AnalyticsProperties = Record<string, AnalyticsProperty>;

type PostHogBrowserClient = {
  capture?: (event: string, properties?: AnalyticsProperties) => void;
  captureException?: (error: unknown, properties?: AnalyticsProperties) => void;
};

declare global {
  interface Window {
    posthog?: PostHogBrowserClient;
  }
}

const baseProperties: AnalyticsProperties = {
  app: "talentflow",
  product_mode: "portfolio_demo",
};

export function trackAnalyticsEvent(event: string, properties: AnalyticsProperties = {}) {
  if (typeof window === "undefined") return;

  window.posthog?.capture?.(event, {
    ...baseProperties,
    ...properties,
  });
}

export function captureAnalyticsException(error: unknown, properties: AnalyticsProperties = {}) {
  if (typeof window === "undefined") return;

  window.posthog?.captureException?.(error, {
    ...baseProperties,
    ...properties,
  });
}
