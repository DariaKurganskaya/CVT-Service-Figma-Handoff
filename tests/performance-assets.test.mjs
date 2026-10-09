import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("static export discovers the hero early and defers below-fold pictures", async () => {
  const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");
  const links = html.match(/<link\b[^>]*>/g) ?? [];
  assert.ok(links.some((link) => link.includes('href="/hero-variator-real.jpg"') && link.includes('rel="preload"') && link.includes('fetchPriority="high"')));
  for (const src of ["/service-diagnostic.webp", "/process-repair-real.jpg", "/brands/nissan.png"]) {
    const image = (html.match(/<img\b[^>]*>/g) ?? []).find((tag) => tag.includes(`src="${src}"`));
    assert.ok(image?.includes('loading="lazy"'), src);
  }
  assert.ok(links.some((link) => link.includes('as="font"') && link.includes('/_next/static/media/')));
  assert.doesNotMatch(html, /fonts\.googleapis\.com|fonts\.gstatic\.com/);
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.doesNotMatch(css, /fonts\.googleapis\.com/);
  assert.match(css, /font-family: var\(--font-montserrat\)/);
});
