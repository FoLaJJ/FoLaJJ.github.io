/* 首页：只依赖轻量索引 IDX（不含答案），分册导航 + 全库搜索 + 总进度 */
(function () {
  var S = window.Shell, $ = S.$, $$ = S.$$;
  var IDX = window.IDX || { t: 0, c: [], i: [], g: { base: 0, adv: 0, deep: 0, hot: 0 } };
  var PARTS = window.PARTS || [];

  var byPartId = {};
  PARTS.forEach(function (p) { byPartId[p.id] = p; });
  var catMeta = {};
  IDX.c.forEach(function (c) { catMeta[c.i] = c; });

  /* 每册题数、难度分布、uid 列表（一次遍历建好，之后只查表） */
  var stat = {}, uids = {};
  PARTS.forEach(function (p) { stat[p.id] = { n: 0, base: 0, adv: 0, deep: 0, hot: 0 }; uids[p.id] = []; });
  IDX.i.forEach(function (r) {
    var c = catMeta[r[3]];
    if (!c) return;
    var s = stat[c.p];
    if (!s) return;
    s.n++;
    if (s[r[2]] != null) s[r[2]]++;
    uids[c.p].push({ uid: r[0] });
  });

  function pad(v, n) { var s = String(v); while (s.length < n) s = '0' + s; return s; }

  /* ---------- 头部统计 ---------- */
  var g = IDX.g;
  $('#heroStats').innerHTML =
    '<div class="metric"><b>' + IDX.t + '</b><span>题目总数</span></div>' +
    '<div class="metric"><b>' + IDX.c.length + '</b><span>知识模块</span></div>' +
    '<div class="metric"><b>' + PARTS.length + '</b><span>分册</span></div>' +
    '<div class="metric m-base"><b>' + g.base + '</b><span>基础</span></div>' +
    '<div class="metric m-adv"><b>' + g.adv + '</b><span>进阶</span></div>' +
    '<div class="metric m-deep"><b>' + g.deep + '</b><span>深水</span></div>' +
    '<div class="metric m-hot"><b>' + g.hot + '</b><span>热点</span></div>';
  $('#mTotal').textContent = IDX.t;
  var badge = document.querySelector('.hero-badge');
  if (badge) badge.innerHTML = '<i></i>' + IDX.t + ' QUESTIONS · ' + IDX.c.length + ' MODULES · ' + PARTS.length + ' VOLUMES';

  var CIRC = 2 * Math.PI * 26;
  function renderRing() {
    var read = S.readTotal();
    var pct = IDX.t ? Math.round(read / IDX.t * 100) : 0;
    var fg = document.getElementById('ringFg');
    if (fg) { fg.setAttribute('stroke-dasharray', CIRC); fg.style.strokeDashoffset = CIRC - CIRC * pct / 100; }
    $('#ringTxt').textContent = pct + '%';
    $('#doneTxt').textContent = read + ' / ' + IDX.t + ' 题已读';
    PARTS.forEach(function (p) {
      var list = uids[p.id] || [];
      var d = S.countRead(list);
      var bar = document.querySelector('[data-pbar="' + p.id + '"]');
      if (bar) bar.style.width = (list.length ? d / list.length * 100 : 0) + '%';
      var t = document.querySelector('[data-ppct="' + p.id + '"]');
      if (t) t.textContent = d + '/' + list.length;
    });
  }

  /* ---------- 分册卡片 ---------- */
  function partCard(p) {
    var s = stat[p.id] || { n: 0, base: 0, adv: 0, deep: 0, hot: 0 };
    return '<a class="part-card" data-tone="' + p.tone + '" href="pages/' + p.file + '">' +
      '<div class="pc-top">' +
        '<div class="pc-ic"><svg viewBox="0 0 24 24">' + p.icon + '</svg></div>' +
        '<div class="pc-no">' + p.no + '</div>' +
      '</div>' +
      '<h3>' + p.title + '</h3>' +
      '<p>' + p.sub + '</p>' +
      '<div class="pc-foot">' +
        '<span class="pc-count">' + s.n + ' 题</span>' +
        '<span class="pc-dots">' +
          '<i class="b">' + s.base + '</i><i class="a">' + s.adv + '</i><i class="d">' + s.deep + '</i><i class="h">' + s.hot + '</i>' +
        '</span>' +
        '<span class="pc-pct" data-ppct="' + p.id + '"></span>' +
      '</div>' +
      '<div class="pc-bar"><i data-pbar="' + p.id + '" style="width:0"></i></div>' +
      '<div class="pc-go"><span>进入分册</span>' +
        '<svg viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg></div>' +
    '</a>';
  }
  /* ---------- 分册卡片：按大类分组 ---------- */
  $('#partGrid').innerHTML = (window.GROUPS && window.GROUPS.length ? window.GROUPS : [{ name: '全部分册', parts: PARTS }])
    .map(function (gp) {
      return '<div class="pg-group">' +
        '<div class="pg-title"><b>' + gp.name + '</b><span>' + gp.parts.length + ' 册</span></div>' +
        '<div class="pg-row">' + gp.parts.map(partCard).join('') + '</div></div>';
    }).join('');

  /* ---------- 模块速览：编号与分册页一致（分册号-章节号） ---------- */
  $('#modGrid').innerHTML = IDX.c.map(function (c) {
    var p = byPartId[c.p];
    if (!p) return '';
    return '<a class="mod-item" data-tone="' + p.tone + '" href="pages/' + p.file + '#sec-' + c.i + '">' +
      '<b>' + p.no + '-' + pad(c.s, 2) + '</b><span>' + c.t + '</span><em>' + c.n + '</em></a>';
  }).join('');
  $('#modTitle').textContent = IDX.c.length + ' 个模块速览';

  /* ---------- 全库搜索（只查题干 + 模块名，命中后跳分册页定位） ---------- */
  var input = $('#gsearch'), panel = $('#hsPanel');
  function run() {
    var kw = input.value.trim().toLowerCase();
    if (!kw) { panel.classList.remove('on'); panel.innerHTML = ''; return; }
    var hits = [];
    for (var i = 0; i < IDX.i.length && hits.length < 40; i++) {
      var r = IDX.i[i];
      var cm = catMeta[r[3]];
      var hay = (r[1] + ' ' + (cm ? cm.t : '') + ' ' + S.tagName(r[2])).toLowerCase();
      if (hay.indexOf(kw) >= 0) hits.push(r);
    }
    if (!hits.length) {
      panel.innerHTML = '<div class="hs-empty">没有命中的题目，换个关键词试试</div>';
      panel.classList.add('on');
      return;
    }
    panel.innerHTML = hits.map(function (r) {
      var cm = catMeta[r[3]], p = byPartId[cm ? cm.p : ''] || PARTS[0];
      return '<a class="hs-item" href="pages/' + p.file + '#uid=' + r[0] + '">' +
        '<div class="hs-t">' + r[1] + '</div>' +
        '<div class="hs-m"><span>' + p.no + ' · ' + p.title + '</span><span>' + (cm ? cm.t : '') + '</span></div></a>';
    }).join('');
    panel.classList.add('on');
  }
  input.addEventListener('input', run);
  input.addEventListener('focus', function () { if (input.value.trim()) run(); });
  document.addEventListener('click', function (e) {
    if (!panel.contains(e.target) && e.target !== input) panel.classList.remove('on');
  });
  S.initKeys(input, function () { panel.classList.remove('on'); });

  /* ---------- 继续上次阅读 ---------- */
  function renderResume() {
    var box = $('#resume');
    if (!box) return;
    var last = S.getLast();
    if (!last || !last.u) { box.style.display = 'none'; return; }
    var m = /-(\d+)$/.exec(String(last.u));
    var catId = String(last.u).replace(/-\d+$/, '');
    var cm = catMeta[catId];
    var p = cm ? byPartId[cm.p] : null;
    if (!p) { box.style.display = 'none'; return; }
    box.style.display = '';
    box.innerHTML = '<a class="resume-card" href="pages/' + p.file + '#uid=' + encodeURIComponent(last.u) + '">' +
      '<span class="rs-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4l13 8-13 8z"/></svg></span>' +
      '<span class="rs-txt"><b>继续上次阅读</b>' +
      '<i>' + p.no + ' · ' + p.title + (cm ? ' · ' + cm.t : '') + ' 第 ' + (m ? (+m[1] + 1) : 1) + ' 题</i></span>' +
      '<span class="rs-go">进入<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M13 6l6 6-6 6"/></svg></span></a>';
  }

  $('#resetBtn').addEventListener('click', function () {
    if (!confirm('清空全部已读记录？')) return;
    S.clearProgress(); renderRing(); renderResume();
    S.toast('已清空已读记录');
  });

  S.init();
  renderRing();
  renderResume();
})();
