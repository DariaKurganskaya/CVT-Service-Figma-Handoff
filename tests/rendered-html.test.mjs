import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const out = (path) => new URL(`../out/${path}`, import.meta.url);

test("builds the finished CVT Сервис site as static HTML", async () => {
  const [html, privacy, consent, cookies] = await Promise.all([
    readFile(out("index.html"), "utf8"),
    readFile(out("privacy-policy/index.html"), "utf8"),
    readFile(out("personal-data-consent/index.html"), "utf8"),
    readFile(out("cookie-policy/index.html"), "utf8"),
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
  assert.doesNotMatch(html, /Обручева|\+7 \(915\) 644-26-41|servise@remontvariatora1\.ru/);
  assert.doesNotMatch(html, /vinext|cloudflare|chatgpt-auth/i);
});

test("keeps the client content and local visual assets wired", async () => {
  const [page, layout, styles, leadForm, mobileMenu, legalData, config] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/lead-form.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/mobile-menu.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/legal-data.ts", import.meta.url), "utf8"),
    readFile(new URL("../next.config.ts", import.meta.url), "utf8"),
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
  assert.match(leadForm, /disabled=\{isSending\}/);
  assert.doesNotMatch(leadForm, /mailto:|alert\(/);
  assert.match(mobileMenu, /removeAttribute\("open"\)/);
  assert.match(mobileMenu, /#guarantee/);
  assert.match(layout, /CVT Сервис — ремонт вариаторов/);
  assert.doesNotMatch(layout, /next\/headers|headers\(/);
  assert.match(config, /output: "export"/);
  assert.match(config, /trailingSlash: true/);
  assert.match(config, /unoptimized: true/);

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
    access(new URL("../server/cvt-leads.example.php", import.meta.url)),
  ]);
});
