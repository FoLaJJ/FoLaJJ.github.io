/* 生成首页轻量索引 assets/js/idx.js：只含题干与元数据，不含答案。
   首页不再加载 46 个 data 文件（约数 MB），只加载这一份索引。 */
const fs = require('fs'), path = require('path');
global.window = global;
require('./assets/js/kb-core.js');
require('./assets/js/parts.js');
const dir = 'assets/js/data';
fs.readdirSync(dir).sort().forEach(f => eval(fs.readFileSync(path.join(dir, f), 'utf8')));

const partOf = {}, secOf = {};
window.PARTS.forEach(p => p.mods.forEach((m, i) => { partOf[m] = p.id; secOf[m] = i + 1; }));

const cats = [];
const items = [];
const tags = { base: 0, adv: 0, deep: 0, hot: 0 };
const byId = {};
window.KB.cats.forEach(c => byId[c.id] = c);

window.PARTS.forEach(p => {
  p.mods.forEach(mid => {
    const c = byId[mid];
    if (!c) { console.log('WARN 缺模块', mid); return; }
    cats.push({ i: c.id, t: c.title, n: c.items.length, p: p.id, s: secOf[mid] });
    c.items.forEach((it, ix) => {
      items.push([c.id + '-' + ix, it.q, it.tag, c.id]);
      if (tags[it.tag] != null) tags[it.tag]++;
    });
  });
});

const out = '/* 自动生成（build-index.js）：首页轻量索引，勿手改 */\n' +
  'window.IDX=' + JSON.stringify({ t: items.length, c: cats, i: items, g: tags }) + ';\n';
fs.writeFileSync('assets/js/idx.js', out, 'utf8');
console.log('idx.js', (out.length / 1024).toFixed(0) + 'KB', '| 题', items.length, '| 模块', cats.length, '| 难度', JSON.stringify(tags));
