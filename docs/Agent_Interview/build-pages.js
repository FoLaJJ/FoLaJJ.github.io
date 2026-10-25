/* 一次性生成脚本：按 parts.js 生成 pages/pXX-*.html
   注意：脚本会把 pages/p01-core.html 当作模板并回写它，因此所有占位符的正则
   必须写成「通用」形式，不能写死第一次生成时的具体值，否则第二次运行就匹配不上。 */
const fs = require('fs'), path = require('path');
global.window = global;
require('./assets/js/kb-core.js');
require('./assets/js/parts.js');
const dir = 'assets/js/data';
const files = fs.readdirSync(dir).sort();
files.forEach(f => eval(fs.readFileSync(path.join(dir, f), 'utf8')));
const idToFile = {};
files.forEach(f => { const m = /^\d\d-(.+)\.js$/.exec(f); if (m) idToFile[m[1]] = f; });

const byId = {};
window.KB.cats.forEach(c => byId[c.id] = c);
const N = window.PARTS.length;

const tpl = fs.readFileSync('pages/p01-core.html', 'utf8');

/* 资源版本戳：HTML 更新了但浏览器/预览服务还在用旧的 CSS 时，
   新结构会以「裸文本」形式出现（没有卡片、标签挤在一起）。每次构建刷一次。 */
const STAMP = Date.now().toString(36);
function stampAssets(html) {
  return html.replace(/(href|src)="(\.\.\/assets\/(?:css|js)\/[^"]+?)(\?v=[^"]*)?"/g,
    function (m, attr, url) { return attr + '="' + url + '?v=' + STAMP + '"'; });
}

window.PARTS.forEach(p => {
  const mods = p.mods.map(id => byId[id]).filter(Boolean);
  const count = mods.reduce((a, c) => a + c.items.length, 0);
  let s = tpl;
  s = s.replace(/<title>.*?<\/title>/, '<title>' + p.no + ' ' + p.title + ' · Agent 面试题库</title>');
  s = s.replace(/data-part="[^"]*" data-tone="[^"]*"/, 'data-part="' + p.id + '" data-tone="' + p.tone + '"');
  s = s.replace(/PART \d+ \/ \d+/, 'PART ' + p.no + ' / ' + String(N).padStart(2, '0'));
  s = s.replace(/<span class="cur">.*?<\/span>/, '<span class="cur">' + p.no + ' · ' + p.title + '</span>');
  s = s.replace(/<div class="pt-no">.*?<\/div>/, '<div class="pt-no">PART ' + p.no + ' · ' + mods.length + ' 个模块 · ' + count + ' 题</div>');
  s = s.replace(/<h1>.*?<\/h1>/, '<h1>' + p.title + '</h1>');
  s = s.replace(/(<h1>.*?<\/h1>\n    <p>).*?(<\/p>)/, '$1' + p.sub + '$2');
  const scripts = mods.map(c => '<script src="../assets/js/data/' + idToFile[c.id] + '"></script>').join('\n');
  s = s.replace(/(?:<script src="\.\.\/assets\/js\/data\/[^"]+"><\/script>\s*)+/, scripts + '\n');
  /* 校验：结果里必须只剩本册需要的脚本（p01 替换后与原文相同属正常，不能用字符串相等判断） */
  var now = (s.match(/<script src="\.\.\/assets\/js\/data\/[^"]+"><\/script>/g) || []);
  var want = scripts.split('\n');
  if (now.length !== want.length || now.some(function (x, i) { return x !== want[i]; })) {
    console.log('WARN 脚本未替换', p.id, now.join(' | '));
  }
  fs.writeFileSync('pages/' + p.file, stampAssets(s), 'utf8');
  console.log('generated', p.file, count, '题 /', mods.length, '模块');
});
