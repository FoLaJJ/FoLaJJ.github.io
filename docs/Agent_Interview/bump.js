/* 资源缓存刷新：把 index.html 与 pages/*.html 里所有 assets 引用的 ?v= 统一换成当前时间戳。
   什么时候跑：只改了 CSS / JS 而没有重新 build-pages 的时候。
   为什么需要：HTML 已经更新、但浏览器或预览服务还在用旧 CSS 时，
   新加的区块会退化成裸文本（没有卡片背景、标签挤成一团），而且表现为「偶发」。 */
const fs = require('fs'), path = require('path');
const STAMP = Date.now().toString(36);
const RE = /(href|src)="((?:\.\.\/)?assets\/(?:css|js)\/[^"]+?)(\?v=[^"]*)?"/g;

let hits = 0, files = 0;
const list = ['index.html'].concat(
  fs.readdirSync(path.join(__dirname, 'pages')).filter(f => f.endsWith('.html')).map(f => 'pages/' + f)
);
list.forEach(function (rel) {
  const p = path.join(__dirname, rel);
  const before = fs.readFileSync(p, 'utf8');
  const after = before.replace(RE, function (m, attr, url) { hits++; return attr + '="' + url + '?v=' + STAMP + '"'; });
  if (after !== before) { fs.writeFileSync(p, after, 'utf8'); files++; }
});
console.log('刷新 ' + hits + ' 处资源引用（' + files + ' 个文件）→ ?v=' + STAMP);
