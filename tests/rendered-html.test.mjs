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
