import assert from "node:assert/strict";
import test from "node:test";
import {
  activateMetrikaIfConsented,
  ANALYTICS_CONSENT,
  NECESSARY_CONSENT,
  YANDEX_METRIKA_COUNTER_ID,
} from "../app/yandex-metrika-loader.js";

function createBrowser() {
  const scripts = [];
  const documentRef = {
    referrer: "https://example.test/previous",
    head: {
      appendChild(script) {
        scripts.push(script);
      },
    },
    createElement() {
      return { dataset: {} };
    },
    querySelector(selector) {
      return scripts.find((script) => selector.includes(script.dataset.yandexMetrika)) ?? null;
    },
  };
  return { documentRef, scripts, windowRef: { location: { href: "https://remontvariator.ru/" } } };
}

test("does not request Metrika before consent or after choosing necessary-only cookies", () => {
  const fresh = createBrowser();
  assert.equal(activateMetrikaIfConsented({ ...fresh, consent: null }), false);
  assert.equal(fresh.scripts.length, 0);

  const rejectedAfterReload = createBrowser();
  assert.equal(activateMetrikaIfConsented({ ...rejectedAfterReload, consent: NECESSARY_CONSENT }), false);
  assert.equal(rejectedAfterReload.scripts.length, 0);
});

test("loads one tag.js and one initialization only after analytics consent", () => {
  const browser = createBrowser();
  assert.equal(activateMetrikaIfConsented({ ...browser, consent: ANALYTICS_CONSENT }), true);
  assert.equal(browser.scripts.length, 1);
  assert.equal(browser.scripts[0].src, `https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_COUNTER_ID}`);
  assert.equal(browser.windowRef.ym.a.length, 1);
  assert.deepEqual(browser.windowRef.ym.a[0], [
    YANDEX_METRIKA_COUNTER_ID,
    "init",
    {
      ssr: true,
      webvisor: true,
      clickmap: true,
      ecommerce: "dataLayer",
      referrer: "https://example.test/previous",
      url: "https://remontvariator.ru/",
      accurateTrackBounce: true,
      trackLinks: true,
    },
  ]);

  activateMetrikaIfConsented({ ...browser, consent: ANALYTICS_CONSENT });
  assert.equal(browser.scripts.length, 1);
  assert.equal(browser.windowRef.ym.a.length, 1);
});
