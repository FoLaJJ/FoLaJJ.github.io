/* 首页：分册导航、全局搜索、总进度 */
(function () {
  var S = window.Shell;
  var $ = S.$, $$ = S.$$;

  var cats = window.KB.cats;
  var total = window.KB.total();
  var tags = window.KB.countByTag();
  var all = [];
  cats.forEach(function (c) {
    c.items.forEach(function (it, i) {
      all.push({ uid: c.id + '-' + i, q: it.q, a: it.a, tag: it.tag, cat: c.title, catId: c.id });
    });
  });

  /* 模块 id → 所属分册 */
  var partOf = {};
  window.PARTS.forEach(function (p) {
    p.mods.forEach(function (m) { partOf[m] = p; });
  });

  /* ---------- 头部统计 ---------- */
  $('#heroStats').innerHTML =
    '<div class="metric"><b>' + total + '</b><span>题目总数</span></div>' +
    '<div class="metric"><b>' + cats.length + '</b><span>知识模块</span></div>' +
    '<div class="metric"><b>' + window.PARTS.length + '</b><span>分册</span></div>' +
    '<div class="metric m-base"><b>' + tags.base + '</b><span>基础</span></div>' +
    '<div class="metric m-adv"><b>' + tags.adv + '</b><span>进阶</span></div>' +
    '<div class="metric m-deep"><b>' + tags.deep + '</b><span>深水</span></div>' +
    '<div class="metric m-hot"><b>' + tags.hot + '</b><span>热点</span></div>';
  $('#mTotal').textContent = total;

  var CIRC = 2 * Math.PI * 26;
  function renderRing() {
    var read = S.readTotal();
    var pct = total ? Math.round(read / total * 100) : 0;
    var fg = document.getElementById('ringFg');
    if (fg) { fg.setAttribute('stroke-dasharray', CIRC); fg.style.strokeDashoffset = CIRC - CIRC * pct / 100; }
    $('#ringTxt').textContent = pct + '%';
    $('#doneTxt').textContent = read + ' / ' + total + ' 题已读';
    window.PARTS.forEach(function (p) {
      var el = document.querySelector('[data-pbar="' + p.id + '"]');
      if (!el) return;
      var ids = p.mods;
      var list = all.filter(function (i) { return ids.indexOf(i.catId) >= 0; });
      var d = S.countRead(list);
      el.style.width = (list.length ? d / list.length * 100 : 0) + '%';
      var t = document.querySelector('[data-ppct="' + p.id + '"]');
      if (t) t.textContent = d + '/' + list.length;
    });
  }

  /* ---------- 分册卡片 ---------- */
  function partCard(p) {
    var list = all.filter(function (i) { return p.mods.indexOf(i.catId) >= 0; });
    var t = { base: 0, adv: 0, deep: 0, hot: 0 };
    list.forEach(function (i) { t[i.tag]++; });
    return '<a class="part-card" data-tone="' + p.tone + '" href="pages/' + p.file + '">' +
      '<div class="pc-top">' +
        '<div class="pc-ic"><svg viewBox="0 0 24 24">' + p.icon + '</svg></div>' +
        '<div class="pc-no">' + p.no + '</div>' +
      '</div>' +
      '<h3>' + p.title + '</h3>' +
      '<p>' + p.sub + '</p>' +
      '<div class="pc-foot">' +
        '<span class="pc-count">' + list.length + ' 题</span>' +
        '<span class="pc-dots">' +
          '<i class="b">' + t.base + '</i><i class="a">' + t.adv + '</i><i class="d">' + t.deep + '</i><i class="h">' + t.hot + '</i>' +
        '</span>' +
        '<span class="pc-pct" data-ppct="' + p.id + '"></span>' +
      '</div>' +
      '<div class="pc-bar"><i data-pbar="' + p.id + '" style="width:0"></i></div>' +
      '<div class="pc-go"><span>进入分册</span>' +
        '<svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg></div>' +
    '</a>';
  }
  /* ---------- 模块速览：按分册顺序排列，编号与分册页完全一致（分册号-章节号） ---------- */
  var ordered = [], seen = {};
  window.PARTS.forEach(function (p) {
    p.mods.forEach(function (mid, i) {
      var c = cats.filter(function (x) { return x.id === mid; })[0];
      if (!c) return;
      seen[c.id] = 1;
      ordered.push({ c: c, p: p, secNo: i + 1 });
    });
  });
  cats.forEach(function (c) {           /* 兜底：未归入任何分册的模块排在最后 */
    if (!seen[c.id]) ordered.push({ c: c, p: partOf[c.id] || window.PARTS[0], secNo: 1 });
  });
  function pad(v, len) { var s = String(v); while (s.length < len) s = '0' + s; return s; }
  $('#modGrid').innerHTML = ordered.map(function (o) {
    return '<a class="mod-item" data-tone="' + o.p.tone + '" href="pages/' + o.p.file + '#sec-' + o.c.id + '">' +
      '<b>' + o.p.no + '-' + pad(o.secNo, 2) + '</b><span>' + o.c.title + '</span><em>' + o.c.items.length + '</em></a>';
  }).join('');

  $('#partGrid').innerHTML = window.PARTS.map(partCard).join('');

  /* ---------- 全局搜索 ---------- */
  var input = $('#gsearch'), panel = $('#hsPanel');
  function run() {
    var kw = input.value.trim().toLowerCase();
    if (!kw) { panel.classList.remove('on'); panel.innerHTML = ''; return; }
    var hits = all.filter(function (i) {
      var hay = (i.q + ' ' + i.cat + ' ' + (Array.isArray(i.a) ? i.a.join(' ') : i.a)).toLowerCase();
      return hay.indexOf(kw) >= 0;
    }).slice(0, 40);
    if (!hits.length) {
      panel.innerHTML = '<div class="hs-empty">没有命中的题目，换个关键词试试</div>';
      panel.classList.add('on');
      return;
    }
    panel.innerHTML = hits.map(function (i) {
      var p = partOf[i.catId] || window.PARTS[0];
      return '<a class="hs-item" href="pages/' + p.file + '#uid=' + i.uid + '">' +
        '<div class="hs-t">' + i.q + '</div>' +
        '<div class="hs-m"><span>' + p.no + ' · ' + p.title + '</span><span>' + i.cat + '</span></div></a>';
    }).join('') + (all.length > 40 ? '' : '');
    panel.classList.add('on');
  }
  input.addEventListener('input', run);
  input.addEventListener('focus', function () { if (input.value.trim()) run(); });
  document.addEventListener('click', function (e) {
    if (!panel.contains(e.target) && e.target !== input) panel.classList.remove('on');
  });
  S.initKeys(input, function () { panel.classList.remove('on'); });

  /* ---------- 继续上次阅读（位置由分册页自动记录） ---------- */
  function renderResume() {
    var box = $('#resume');
    if (!box) return;
    var last = S.getLast();
    if (!last || !last.u) { box.style.display = 'none'; return; }
    var catId = String(last.u).replace(/-\d+$/, '');
    var p = partOf[catId];
    var cat = cats.filter(function (c) { return c.id === catId; })[0];
    var idx = parseInt(String(last.u).match(/-(\d+)$/)[1], 10) + 1;
    if (!p) { box.style.display = 'none'; return; }
    box.style.display = '';
    box.innerHTML = '<a class="resume-card" href="pages/' + p.file + '#uid=' + encodeURIComponent(last.u) + '">' +
      '<span class="rs-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4l13 8-13 8z"/></svg></span>' +
      '<span class="rs-txt"><b>继续上次阅读</b>' +
      '<i>' + p.no + ' · ' + p.title + (cat ? ' · ' + cat.title : '') + ' 第 ' + idx + ' 题</i></span>' +
      '<span class="rs-go">进入<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M13 6l6 6-6 6"/></svg></span></a>';
  }

  $('#resetBtn').addEventListener('click', function () {
    if (!confirm('清空全部已读记录？')) return;
    S.store = {}; S.save(); S.clearLast(); renderRing(); renderResume();
    S.toast('已清空已读记录');
  });

  S.init();
  renderRing();
  renderResume();
})();
