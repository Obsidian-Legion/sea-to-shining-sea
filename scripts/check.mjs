import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { pages } from './pages.mjs';
const root = path.resolve(import.meta.dirname, '../dist');
const documents = new Map(await Promise.all(pages.map(async ({ file }) => [file, await readFile(path.join(root, file), 'utf8')])));
const titles = new Set();
for (const [file, html] of documents) {
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${file}: exactly one h1`);
  assert.equal((html.match(/<main\b/g) || []).length, 1, `${file}: exactly one main`);
  assert.match(html, /<html lang="en"/);
  assert.match(html, /<meta name="viewport"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/Obsidian-Legion.github.io\/sea-to-shining-sea\//);
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert.ok(title && !titles.has(title), `${file}: unique title`);
  titles.add(title);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, `${file}: unique IDs`);
  for (const [, ref] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|data:)/.test(ref)) continue;
    assert.ok(!ref.startsWith('/'), `${file}: GitHub project-path compatible link ${ref}`);
    const [target, hash] = ref.split('#');
    if (target) await access(path.join(root, target.split('?')[0]));
    if (hash) {
      const targetHtml = documents.get(target || file);
      assert.ok(targetHtml?.includes(`id="${hash}"`), `${file}: broken fragment ${ref}`);
    }
  }
  for (const [, tag] of html.matchAll(/(<img\b[^>]*>)/g)) assert.match(tag, /\balt="/);
}
const css = await readFile(path.join(root, 'styles.css'), 'utf8');
assert.match(css, /prefers-reduced-motion/);
const home = documents.get('index.html');
assert.equal((home.match(/class="dispatch-card"/g) || []).length, 4);
assert.match(home, /not published field reports/);
for (const [file, html] of documents) {
  if (['index.html', 'editorial.html'].includes(file)) continue;
  assert.match(html, /not a completed field report/);
  assert.match(html, /ILLUSTRATIVE, NOT DOCUMENTARY/);
}
for (const [, target] of (await readFile(path.join(root, 'assets/fonts.css'), 'utf8')).matchAll(/url\(([^)]+)\)/g)) {
  assert.ok(!target.startsWith('http'), 'Fonts must be served locally');
  await access(path.join(root, 'assets', target));
}
console.log(`Passed: ${documents.size} Unison pages, local assets, project-path links and fragments, unique metadata, image alternatives, preview disclosures, local fonts, and reduced motion.`);
