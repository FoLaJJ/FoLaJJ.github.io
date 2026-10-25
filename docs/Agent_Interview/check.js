/* 全库体检：字段完整性、重复题干、标签闭合、parts 覆盖、题干长度分布 */
const fs = require('fs'), path = require('path');
global.window = global;
require('./assets/js/kb-core.js');
require('./assets/js/parts.js');
const dir = path.join(__dirname, 'assets/js/data');
fs.readdirSync(dir).sort().forEach(f => {
  try { eval(fs.readFileSync(path.join(dir, f), 'utf8')); }
  catch (e) { console.log('LOAD FAIL', f, e.message); process.exitCode = 1; }
});

const byId = {};
window.KB.cats.forEach(c => byId[c.id] = c);
const FIELDS = ['q', 'tag', 'a', 'plus', 'warn', 'follow', 'why', 'num'];
const TAGS = { base: 1, adv: 1, deep: 1, hot: 1 };
let total = 0, bad = [];
const seen = new Map();
const lens = [];

window.KB.cats.forEach(c => {
  c.items.forEach((it, ix) => {
    total++;
    const uid = c.id + '-' + ix;
    FIELDS.forEach(f => {
      const v = it[f];
      if (v == null || (typeof v === 'string' && !v.trim()) || (Array.isArray(v) && !v.length)) bad.push(uid + ' 缺字段 ' + f);
    });
    if (Array.isArray(it.a) && (it.a.length < 2 || it.a.length > 5)) bad.push(uid + ' 答案条数 ' + (it.a ? it.a.length : 0));
    if (!TAGS[it.tag]) bad.push(uid + ' 非法 tag ' + it.tag);
    const html = JSON.stringify(it);
    const open = (html.match(/<b>/g) || []).length, close = (html.match(/<\/b>/g) || []).length;
    if (open !== close) bad.push(uid + ' <b> 不闭合 ' + open + '/' + close);
    const OKTAG = /<\/?(b|code|i|span|em|br|tools|toolcall)>/g;
    const stray = html.replace(/<\/?b>/g, '').replace(OKTAG, '').match(/<\/?[a-zA-Z][a-zA-Z0-9]*(\s[^<>]*)?>/g);
    if (stray) bad.push(uid + ' 含非法 HTML 标签 ' + [...new Set(stray)].join(','));
    const q = String(it.q || '');
    lens.push(q.length);
    if (q.length < 24) bad.push(uid + ' 题干过短 ' + q.length);
    if (q.length > 95) bad.push(uid + ' 题干过长 ' + q.length);
    if (seen.has(q)) bad.push(uid + ' 题干重复于 ' + seen.get(q));
    else seen.set(q, uid);
  });
});

/* parts 覆盖检查 */
const used = new Set();
window.PARTS.forEach(p => p.mods.forEach(m => { used.add(m); if (!byId[m]) bad.push('parts 引用了不存在的模块 ' + m); }));
window.KB.cats.forEach(c => { if (!used.has(c.id)) bad.push('模块未被任何分册引用：' + c.id); });

lens.sort((a, b) => a - b);
const mid = lens[Math.floor(lens.length / 2)];
console.log('模块', window.KB.cats.length, '| 题目', total, '| 分册', window.PARTS.length);
console.log('题干长度 min', lens[0], 'median', mid, 'max', lens[lens.length - 1]);
if (bad.length) { console.log('问题', bad.length, '条'); bad.slice(0, 40).forEach(b => console.log('  -', b)); process.exitCode = 1; }
else console.log('体检通过：0 问题');
