import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const out = (path) => new URL(`../out/${path}`, import.meta.url);

test("builds the finished CVT Сервис site as static HTML", async () => {
  const [html, privacy, consent, cookies, robots, sitemap] = await Promise.all([
    readFile(out("index.html"), "utf8"),
    readFile(out("privacy-policy/index.html"), "utf8"),
    readFile(out("personal-data-consent/index.html"), "utf8"),
    readFile(out("cookie-policy/index.html"), "utf8"),
    readFile(out("robots.txt"), "utf8"),
    readFile(out("sitemap.xml"), "utf8"),
  ]);

  assert.match(html, /<title>CVT Сервис — ремонт вариаторов в Москве<\/title>/i);
  assert.match(html, /Профессиональный ремонт/);
  assert.match(html, /Бесплатно за 30 минут найдём причину неисправности/);
  assert.match(html, /Мы эксперты/);
  assert.match(html, /наши услуги/i);
  assert.match(html, /Что говорят/);
  assert.match(html, /\+7 \(950\) 701-82-52/);
  assert.match(html, /Ступинский проезд, д\. 5, стр\. 6/);
  assert.match(html, /info@remontvariator\.ru/);
  assert.match(html, /https:\/\/t\.me\/inkom10/);
  assert.match(html, /https:\/\/wa\.me\/79014037963/);
  assert.match(html, /href="\/privacy-policy\/"/);
  assert.match(html, /href="\/personal-data-consent\/"/);
  assert.match(html, /href="\/cookie-policy\/"/);
  assert.match(privacy, /Политика обработки персональных данных/);
  assert.match(consent, /Согласие на обработку персональных данных/);
  assert.match(cookies, /Политика использования cookie и внешних сервисов/);
  assert.match(cookies, /Яндекс Метрика/);
  assert.match(cookies, /112386504/);
  assert.match(html, /rel="canonical" href="https:\/\/remontvariator\.ru\/"/);
  assert.match(html, /"@type":"AutoRepair"/);
  assert.match(html, /"openingHours":\["Mo-Su 08:00-21:00"\]/);
  assert.match(privacy, /rel="canonical" href="https:\/\/remontvariator\.ru\/privacy-policy\/"/);
  assert.match(consent, /rel="canonical" href="https:\/\/remontvariator\.ru\/personal-data-consent\/"/);
  assert.match(cookies, /rel="canonical" href="https:\/\/remontvariator\.ru\/cookie-policy\/"/);
  assert.match(robots, /Sitemap: https:\/\/remontvariator\.ru\/sitemap\.xml/);
  assert.doesNotMatch(robots, /chatgpt\.site|localhost/i);
  for (const url of [
    "https://remontvariator.ru/",
    "https://remontvariator.ru/privacy-policy/",
    "https://remontvariator.ru/personal-data-consent/",
    "https://remontvariator.ru/cookie-policy/",
  ]) {
    assert.match(sitemap, new RegExp(url.replaceAll("/", "\\/")));
  }
  assert.doesNotMatch(html, /Обручева|\+7 \(915\) 644-26-41|servise@remontvariatora1\.ru/);
  assert.doesNotMatch(html, /vinext|cloudflare|chatgpt-auth/i);
});

test("keeps the client content and local visual assets wired", async () => {
  const [page, layout, styles, leadForm, mobileMenu, legalData, config, phoneFormat, floatingCall, cookieConsent, yandexMetrika, yandexLoader] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/lead-form.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/mobile-menu.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/legal-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../next.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/phone.js", import.meta.url), "utf8"),
    readFile(new URL("../app/floating-call.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/cookie-consent.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/yandex-metrika.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/yandex-metrika-loader.js", import.meta.url), "utf8"),
  ]);

  assert.match(page, /8 500\+/);
  assert.match(page, /до 24 месяцев/);
  assert.match(legalData, /Ступинский проезд, д\. 5, стр\. 6/);
  assert.match(legalData, /info@remontvariator\.ru/);
  assert.match(page, /yandex\.ru\/map-widget/);
  assert.match(styles, /hero-variator-real\.jpg/);
  assert.match(styles, /background-position: 57% 365px/);
  assert.match(styles, /grid-template-areas:/);
  assert.match(styles, /width: calc\(100% - 14px\)/);
  assert.match(styles, /\.contactForm \.leadConsent input\[type="checkbox"\]/);
  assert.match(styles, /width: 20px/);
  assert.match(styles, /scroll-margin-top: 76px/);
  assert.doesNotMatch(styles, /\.brandGrid[^\n]*filter:|\.brandGrid figure:hover img \{ filter:/);
  assert.match(styles, /\.footerMenu \{ flex-direction: row/);
  assert.match(page, /className="headerAddress"/);
  assert.match(page, /className="headerHours"/);
  assert.match(page, /client-logo-clean\.png/);
  assert.match(legalData, /\/social\/max\.png/);
  assert.match(legalData, /\/social\/telegram\.png/);
  assert.match(legalData, /\/social\/whatsapp\.png/);
  assert.match(page, /Стоимость и гарантия фиксируются до ремонта/);
  assert.match(page, /className="footerMenu"/);
  assert.match(page, /className="contactEmail"/);
  assert.doesNotMatch(page, /На фото — вариатор CVT|cvtProof/);
  assert.match(page, /service-diagnostic\.webp/);
  assert.match(page, /process-repair-real\.jpg/);
  assert.match(legalData, /\+7 \(950\) 701-82-52/);
  assert.match(legalData, /https:\/\/wa\.me\/79014037963/);
  assert.match(legalData, /\+7 \(915\) 643-39-67/);
  assert.doesNotMatch(page, /https:\/\/web\.max\.ru/);
  assert.match(page, /href="#guarantee"/);
  assert.match(page, /reviews\.map\(\(review\)/);
  assert.doesNotMatch(page, /Георгий Беляев|Александр Моисеев|Захар Мельников/);
  assert.doesNotMatch(page, /Обручева|servise@remontvariatora1\.ru|mailto:servise/);
  assert.match(leadForm, /id="lead-form"/);
  assert.match(leadForm, /event\.preventDefault\(\)/);
  assert.match(leadForm, /fetch\("\/api\/lead\.php"/);
  assert.match(leadForm, /name="consent"/);
  assert.match(leadForm, /name="website"/);
  assert.equal((leadForm.match(/ym-disable-keys/g) ?? []).length, 8);
  assert.match(leadForm, /disabled=\{isSending\}/);
  assert.match(leadForm, /formatRussianPhone/);
  assert.match(leadForm, /isCompleteRussianPhone/);
  assert.doesNotMatch(leadForm, /mailto:|alert\(/);
  assert.match(mobileMenu, /removeAttribute\("open"\)/);
  assert.match(mobileMenu, /mobileMenuDocked/);
  assert.match(mobileMenu, /#guarantee/);
  assert.match(layout, /CVT Сервис — ремонт вариаторов/);
  assert.match(layout, /<CookieConsent \/>/);
  assert.match(layout, /<YandexMetrika \/>/);
  assert.doesNotMatch(layout, /next\/headers|headers\(/);
  assert.match(config, /output: "export"/);
  assert.match(config, /trailingSlash: true/);
  assert.match(config, /unoptimized: true/);
  assert.match(phoneFormat, /MAX_RUSSIAN_PHONE_DIGITS = 10/);
  assert.match(floatingCall, /IntersectionObserver/);
  assert.match(page, /application\/ld\+json/);
  assert.match(page, /AutoRepair/);
  assert.match(page, /serviceAddressLines/);
  assert.match(page, /data-cookie-settings/);
  assert.match(cookieConsent, /Разрешить аналитику/);
  assert.match(cookieConsent, /Только необходимые/);
  assert.match(cookieConsent, /localStorage/);
  assert.match(yandexMetrika, /COOKIE_CONSENT_EVENT/);
  assert.match(yandexLoader, /YANDEX_METRIKA_COUNTER_ID = 112386504/);
  assert.match(yandexLoader, /https:\/\/mc\.yandex\.ru\/metrika\/tag\.js\?id=/);
  assert.match(yandexLoader, /hasAnalyticsConsent\(consent\)/);
  assert.doesNotMatch(yandexLoader, /reachGoal|noscript/);

  await Promise.all([
    access(new URL("../public/hero-variator-real.jpg", import.meta.url)),
    access(new URL("../public/client-logo-clean.png", import.meta.url)),
    access(new URL("../public/social/max.png", import.meta.url)),
    access(new URL("../public/social/telegram.png", import.meta.url)),
    access(new URL("../public/social/whatsapp.png", import.meta.url)),
    access(new URL("../public/service-diagnostic.webp", import.meta.url)),
    access(new URL("../public/process-repair-real.jpg", import.meta.url)),
    access(new URL("../public/brands/nissan.png", import.meta.url)),
    access(new URL("../public/brands/toyota.png", import.meta.url)),
    access(out("hero-variator-real.jpg")),
    access(out("social/telegram.png")),
    access(out("brands/nissan.png")),
    access(out("api/lead.php")),
  ]);
});
