export const YANDEX_METRIKA_COUNTER_ID = 112386504;
export const COOKIE_CONSENT_STORAGE_KEY = "cvt-cookie-consent";
export const COOKIE_CONSENT_EVENT = "cvt-cookie-consent-change";
export const ANALYTICS_CONSENT = "analytics";
export const NECESSARY_CONSENT = "necessary";

export function hasAnalyticsConsent(value) {
  return value === ANALYTICS_CONSENT;
}

/**
 * Creates the standard Metriка queue and loads tag.js only after explicit
 * analytics consent. The window-scoped flags keep this safe across client
 * navigations and repeated consent events.
 */
export function activateMetrikaIfConsented({ windowRef, documentRef, consent }) {
  if (!hasAnalyticsConsent(consent)) {
    return false;
  }

  if (!windowRef.ym) {
    const queue = (...args) => {
      queue.a = queue.a || [];
      queue.a.push(args);
    };
    queue.l = Date.now();
    windowRef.ym = queue;
  }

  if (!windowRef.__cvtMetrikaInitialized) {
    windowRef.ym(YANDEX_METRIKA_COUNTER_ID, "init", {
      ssr: true,
      webvisor: true,
      clickmap: true,
      ecommerce: "dataLayer",
      referrer: documentRef.referrer,
      url: windowRef.location.href,
      accurateTrackBounce: true,
      trackLinks: true,
    });
    windowRef.__cvtMetrikaInitialized = true;
  }

  const selector = `script[data-yandex-metrika="${YANDEX_METRIKA_COUNTER_ID}"]`;
  if (!documentRef.querySelector(selector)) {
    const script = documentRef.createElement("script");
    script.async = true;
    script.src = `https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_COUNTER_ID}`;
    script.dataset.yandexMetrika = String(YANDEX_METRIKA_COUNTER_ID);
    documentRef.head.appendChild(script);
  }

  return true;
}
