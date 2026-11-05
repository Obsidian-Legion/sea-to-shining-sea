// Optional maintenance helper. The site serves checked-in fonts locally.
import { writeFile } from 'node:fs/promises';
const cssResponse = await fetch('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Mono:wght@400;500&display=swap', { headers: { 'User-Agent': 'Mozilla/5.0' } });
if (!cssResponse.ok) throw new Error(`Stylesheet request failed: ${cssResponse.status}`);
const stylesheet = await cssResponse.text();
let local = stylesheet;
let i = 0;
for (const url of new Set([...stylesheet.matchAll(/url\((https:[^)]+)\)/g)].map(match => match[1]))) {
  const name = `font-${++i}.ttf`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Font request failed: ${response.status}`);
  await writeFile(`public/assets/${name}`, Buffer.from(await response.arrayBuffer()));
  local = local.replaceAll(url, name);
}
await writeFile('public/assets/fonts.css', local);
console.log(`Vendored ${i} font files.`);
