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
  assert.match(html, /Ремонт вариатора/);
  assert.match(html, /Бесплатно диагностируем неисправность за 30 минут/);
  assert.match(html, /Мы эксперты/);
  assert.match(html, /наши услуги/i);
  assert.match(html, /Что говорят/);
  assert.match(html, /\+7 \(915\) 644-26-41/);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview/i);
});

test("keeps the client content and local visual assets wired", async () => {
  const [page, layout, styles] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /8 500\+/);
  assert.match(page, /до 24 месяцев/);
  assert.match(page, /Обручева 52с13/);
  assert.match(page, /servise@remontvariatora1\.ru/);
  assert.match(page, /yandex\.ru\/map-widget/);
  assert.match(styles, /hero-variator-real\.jpg/);
  assert.match(styles, /background-position: 57% 365px/);
  assert.match(styles, /grid-template-areas:/);
  assert.match(styles, /width: calc\(100% - 14px\)/);
  assert.match(styles, /\.footerMenu \{ flex-direction: row/);
  assert.match(page, /className="headerAddress"/);
  assert.match(page, /className="headerHours"/);
  assert.match(page, /client-logo-clean\.png/);
  assert.match(page, /\/social\/max\.png/);
  assert.match(page, /\/social\/telegram\.png/);
  assert.match(page, /\/social\/whatsapp\.png/);
  assert.match(page, /Стоимость и гарантия фиксируются до ремонта/);
  assert.match(page, /className="footerMenu"/);
  assert.match(page, /className="contactEmail"/);
  assert.doesNotMatch(page, /На фото — вариатор CVT|cvtProof/);
  assert.match(page, /about-workshop-real\.jpg/);
  assert.match(page, /process-repair-real\.jpg/);
  assert.doesNotMatch(page, /\+7 \(950\)|\+7 \(977\)|akpp11122023|79014037963/);
  assert.match(layout, /CVT Сервис — ремонт вариаторов/);

  await Promise.all([
    access(new URL("../public/hero-variator-real.jpg", import.meta.url)),
    access(new URL("../public/client-logo-clean.png", import.meta.url)),
    access(new URL("../public/social/max.png", import.meta.url)),
    access(new URL("../public/social/telegram.png", import.meta.url)),
    access(new URL("../public/social/whatsapp.png", import.meta.url)),
    access(new URL("../public/about-workshop-real.jpg", import.meta.url)),
    access(new URL("../public/process-repair-real.jpg", import.meta.url)),
    access(new URL("../public/brands/nissan.png", import.meta.url)),
    access(new URL("../public/brands/toyota.png", import.meta.url)),
  ]);
});
