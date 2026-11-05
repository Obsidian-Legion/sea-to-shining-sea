import { spawnSync } from 'node:child_process';
import { mkdir, readFile, writeFile, cp } from 'node:fs/promises';
import path from 'node:path';
import { pages } from './pages.mjs';

process.chdir(path.resolve(import.meta.dirname, '..'));
await mkdir('.ucm', { recursive: true });
await mkdir('dist', { recursive: true });
const source = await readFile('src/site.u', 'utf8');
const baseVersion = '7.20.0';
const installedBase = await readFile('.ucm/base-version', 'utf8').catch(() => '');
// UCM typechecks and compiles the real Unison program. Node only orchestrates
// the compiler and captures each executable's generated HTML.
const transcript = [
  ...(installedBase === baseVersion ? [] : ['```ucm', `sea/main> lib.install @unison/base/releases/${baseVersion}`, '```']),
  '```unison', source, '```', '```ucm', 'sea/main> update',
  ...pages.map(({ file, entry }) => `sea/main> compile ${entry} .ucm/${file.replace('.html', '')}`),
  '```', ''].join('\n');
await writeFile('.ucm/build.md', transcript);
function ucm(args) {
  const options = { encoding: 'utf8', maxBuffer: 24 * 1024 * 1024, timeout: 300000 };
  // Fixed commands and paths only; set the Windows code page for Unicode.
  const result = process.platform === 'win32'
    ? spawnSync('cmd.exe', ['/d', '/s', '/c', 'chcp 65001 >nul && ucm ' + args.join(' ')], options)
    : spawnSync('ucm', args, options);
  if (result.error || result.status !== 0) {
    process.stderr.write(result.stderr || '');
    process.stderr.write(result.stdout || '');
    throw result.error || new Error(`UCM failed with exit code ${result.status}`);
  }
  return result.stdout.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');
}
console.log('Typechecking and compiling the Unison publication…');
ucm(['-C', '.ucm', 'transcript.in-place', '.ucm/build.md']);
await writeFile('.ucm/base-version', baseVersion);
await cp('public', 'dist', { recursive: true });
for (const { file } of pages) {
  const html = ucm(['run.compiled', `.ucm/${file.replace('.html', '')}.uc`]).trim();
  if (!html.startsWith('<!doctype html>') || !html.endsWith('</html>')) throw new Error(`Incomplete HTML from ${file}`);
  await writeFile(`dist/${file}`, html + '\n');
  console.log(`Generated ${file} (${Buffer.byteLength(html)} bytes) with Unison.`);
}
await writeFile('dist/.nojekyll', '');
await writeFile('dist/404.html', await readFile('public/not-found.html', 'utf8'));
