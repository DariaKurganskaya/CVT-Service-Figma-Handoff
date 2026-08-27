import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the finished CVT Сервис landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>CVT Сервис — ремонт вариаторов в Москве<\/title>/i);
  assert.match(html, /Профессиональный ремонт/);
  assert.match(html, /Бесплатно за 30 минут найдём причину неисправности/);
  assert.match(html, /Мы эксперты/);
  assert.match(html, /наши услуги/i);
  assert.match(html, /Что говорят/);
  assert.match(html, /\+7 \(950\) 701-82-52/);
  assert.match(html, /Ступинский проезд, д\. 5, стр\. 6/);
  assert.doesNotMatch(html, /Обручева|\+7 \(915\) 644-26-41|servise@remontvariatora1\.ru/);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview/i);
});

test("keeps the client content and local visual assets wired", async () => {
  const [page, layout, styles, leadForm, mobileMenu, legalData] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/lead-form.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/mobile-menu.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/legal-data.ts", import.meta.url), "utf8"),
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
  assert.doesNotMatch(leadForm, /fetch\(/);
  assert.doesNotMatch(leadForm, /mailto:|alert\(/);
  assert.match(mobileMenu, /removeAttribute\("open"\)/);
  assert.match(mobileMenu, /#guarantee/);
  assert.match(layout, /CVT Сервис — ремонт вариаторов/);

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
  ]);
});
