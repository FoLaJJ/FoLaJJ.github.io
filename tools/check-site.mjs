import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative, sep } from 'node:path';
import { parse } from 'parse5';

const out = 'public';
const site = 'https://folajj.github.io';
let problems = 0;
function fail(message) {
  problems++;
  if (problems <= 70) console.error(message);
}
function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(item => {
    const path = join(dir, item.name);
    return item.isDirectory() ? files(path) : [path];
  });
}
const output = new Set(files(out).map(file => relative(out, file).split(sep).join('/')));
function routeFor(url) {
  const name = decodeURIComponent(url.pathname.slice(1));
  if (output.has(name)) return name;
  const index = name.replace(/\/?$/, '/') + 'index.html';
  if (output.has(index.replace(/^\//, ''))) return index.replace(/^\//, '');
}
function checkRef(file, label, ref) {
  if (!ref || ref.startsWith('#')) return;
  if (/^(?:[a-z]:[\\/]|file:)/i.test(ref)) {
    fail(file + ': local machine path in ' + label + '="' + ref + '"');
    return;
  }
  try {
    const base = site + '/' + file.split('/').map(encodeURIComponent).join('/');
    const url = new URL(ref, base);
    if (url.origin === site && !routeFor(url)) fail(file + ': missing ' + label + '="' + ref + '"');
  } catch {
    fail(file + ': invalid ' + label + '="' + ref + '"');
  }
}
for (const file of ['index.html', '404.html', 'archives/index.html', 'categories/index.html', 'tags/index.html',
  'about/index.html', 'tools/index.html', 'local-search.xml', 'site/background.webp', 'site/notes-cover.svg', '.nojekyll', 'robots.txt']) {
  if (!output.has(file)) fail('Missing required output: ' + file);
}
const history = JSON.parse(readFileSync('source/_data/legacy_routes.json', 'utf8'));
for (const [key, target] of Object.entries(history)) checkRef('index.html', 'legacy:' + key, target);

const dirs = ['_media', '_media2', 'pdf', 'MyNavPage', 'SRK_Toolbox', 'Agent_Interview', 'favicon_logosc'];
const raw = dirs.flatMap(dir => files(join('source', dir)));
const digest = f => createHash('sha256').update(readFileSync(f)).digest('hex');
for (const file of raw) {
  const target = relative('source', file).split(sep).join('/');
  if (!output.has(target)) fail('Static file missing: ' + target);
  else {
    const built = join(out, target);
    if (statSync(file).size !== statSync(built).size || digest(file) !== digest(built)) fail('Static file changed: ' + target);
  }
}

let articles = 0;
let pages = 0;
const attributes = { a: ['href'], img: ['src', 'data-src'], link: ['href'], script: ['src'],
  iframe: ['src'], video: ['src', 'poster'], source: ['src'] };
for (const file of output) {
  if (!file.endsWith('.html') || dirs.includes(file.split('/')[0])) continue;
  pages++;
  if (file.startsWith('posts/')) articles++;
  const root = parse(readFileSync(join(out, file), 'utf8'));
  const visit = node => {
    for (const { name, value } of node.attrs || []) {
      if (attributes[node.tagName]?.includes(name)) checkRef(file, name, value);
    }
    for (const child of node.childNodes || []) visit(child);
    if (node.content) visit(node.content);
  };
  visit(root);
}
if (articles < 124) fail('Expected at least the 124 migrated articles, got ' + articles);
console.log(`${articles} articles, ${pages} Hexo HTML files, ${raw.length} byte-identical static files, ${problems} problems.`);
process.exitCode = Number(problems > 0);
