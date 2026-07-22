import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

test("builds the public labor-note entry page", async () => {
  const html = await readFile("pages-dist/index.html", "utf8");
  assert.match(html, /노동노트/);
  assert.match(html, /<div id="root"><\/div>/);
  assert.match(html, /assets\/index-/);
});

test("ships generated official-source content in the client bundle", async () => {
  const assets = await readdir("pages-dist/assets");
  const script = assets.find((name) => name.endsWith(".js"));
  assert.ok(script, "a JavaScript bundle should be emitted");
  const bundle = await readFile(`pages-dist/assets/${script}`, "utf8");
  assert.match(bundle, /고용노동부/);
  assert.match(bundle, /한 줄 기억/);
  await access("pages-dist/og.png");
});

test("keeps substantial five-minute studies with official sources", async () => {
  const data = JSON.parse(await readFile("data/generated-articles.json", "utf8"));
  const studies = data.articles.filter((article) => article.kind === "스터디");
  assert.ok(studies.length >= 7, "the initial study collection should contain at least seven entries");
  for (const study of studies) {
    assert.ok(study.summary.length >= 3, `${study.title} should have a substantial summary`);
    assert.ok(study.summary.every((paragraph) => paragraph.length >= 80));
    assert.ok(study.memory.length >= 20);
    assert.match(study.source, /^https:\/\//);
  }
});
