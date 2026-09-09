"use client";

import { useEffect, useState } from "react";
import {
  ANALYTICS_CONSENT,
  COOKIE_CONSENT_EVENT,
  COOKIE_CONSENT_STORAGE_KEY,
  NECESSARY_CONSENT,
} from "./yandex-metrika-loader";
import { legalLinks } from "./legal-data";

function readCookieConsent() {
  try {
    return window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveCookieConsent(value: typeof ANALYTICS_CONSENT | typeof NECESSARY_CONSENT) {
  try {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, value);
  } catch {
    // If storage is unavailable, the choice remains in the current session.
  }
  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
}

/**
 * Keeps analytics opt-in separate from the technical operation of the site.
 * Any footer link with data-cookie-settings can reopen this panel.
 */
export function CookieConsent() {
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedChoice = readCookieConsent();
    setIsOpen(storedChoice !== ANALYTICS_CONSENT && storedChoice !== NECESSARY_CONSENT);
    setIsReady(true);

    const openSettings = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest("[data-cookie-settings]")) {
        return;
      }

      event.preventDefault();
      setIsOpen(true);
    };

    document.addEventListener("click", openSettings);
    return () => document.removeEventListener("click", openSettings);
  }, []);

  function choose(value: typeof ANALYTICS_CONSENT | typeof NECESSARY_CONSENT) {
    saveCookieConsent(value);
    setIsOpen(false);
  }

  if (!isReady || !isOpen) {
    return null;
  }

  return (
    <section className="cookieBanner" id="cookie-settings" role="region" aria-label="Настройки аналитических cookie">
      <p>
        Мы используем необходимые технологии для работы сайта. С согласия пользователя подключаем Яндекс Метрику для анализа посещаемости.
        Подробнее — в <a href={legalLinks.cookies}>политике cookie</a>.
      </p>
      <div className="cookieBannerActions">
        <button type="button" className="cookieAccept" onClick={() => choose(ANALYTICS_CONSENT)}>Разрешить аналитику</button>
        <button type="button" className="cookieReject" onClick={() => choose(NECESSARY_CONSENT)}>Только необходимые</button>
      </div>
    </section>
  );
}
