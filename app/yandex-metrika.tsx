"use client";

import { useEffect } from "react";
import {
  activateMetrikaIfConsented,
  COOKIE_CONSENT_EVENT,
  COOKIE_CONSENT_STORAGE_KEY,
} from "./yandex-metrika-loader";

function readCookieConsent() {
  try {
    return window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Loads Yandex Metrika once, only after the visitor has opted in. */
export function YandexMetrika() {
  useEffect(() => {
    const loadAfterConsent = () => {
      activateMetrikaIfConsented({
        windowRef: window,
        documentRef: document,
        consent: readCookieConsent(),
      });
    };

    loadAfterConsent();
    window.addEventListener(COOKIE_CONSENT_EVENT, loadAfterConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, loadAfterConsent);
  }, []);

  return null;
}
