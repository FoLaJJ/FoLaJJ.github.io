/* 名词速查页渲染：搜索（词目/全称/中文/定义）、分类筛选、字母索引、
   「只看易混」筛选、cf 相关词跳转。数据来自 glossary-data.js（window.GLOS）。 */
(function () {
  var S = window.Shell, $ = S.$, $$ = S.$$;
  var G = window.GLOS;
  document.documentElement.dataset.tone = 'indigo';

  var state = { kw: '', cat: 'all', ambi: false };

  var CATNAME = {};
  G.cats.forEach(function (c) { CATNAME[c[0]] = c[1]; });

  /* 相关词：按词目长度降序做贪心前缀匹配（cf 是空格分隔的多个词目，可能含多词词目） */
  var CF_TERMS = G.entries.map(function (e) { return e.t; })
    .sort(function (a, b) { return b.length - a.length; });
  var BY_T = {};
  G.entries.forEach(function (e, i) { BY_T[e.t.toLowerCase()] = i; });

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* 高亮：只处理非标签片段（与分册页 page.js 同思路） */
  function markText(html, kw) {
    if (!kw) return html;
    var re;
    try { re = new RegExp('(' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'); }
    catch (e) { return html; }
    return String(html).split(/(<[^>]+>)/).map(function (seg) {
      return seg.charAt(0) === '<' ? seg : seg.replace(re, '<mark>$1</mark>');
    }).join('');
  }

  function letterOf(t) {
    var c = t.charAt(0).toUpperCase();
    return /[A-Z]/.test(c) ? c : '#';
  }

  /* cf 渲染：贪心最长匹配，能对上词目的变成可点跳转 */
  function renderCf(str) {
    var out = '', s = String(str);
    while (s.length) {
      var hit = null;
      for (var i = 0; i < CF_TERMS.length; i++) {
        if (BY_T[CF_TERMS[i].toLowerCase()] != null &&
            s.length >= CF_TERMS[i].length &&
            s.slice(0, CF_TERMS[i].length).toLowerCase() === CF_TERMS[i].toLowerCase()) {
          hit = CF_TERMS[i]; break;
        }
      }
      if (hit) {
        out += '<a class="gl-cf" data-i="' + BY_T[hit.toLowerCase()] + '">' + esc(hit) + '</a>';
        s = s.slice(hit.length).replace(/^\s+/, '');
      } else {
        out += esc(s.charAt(0));
        s = s.slice(1);
      }
    }
    return out;
  }

  function matchEntry(e) {
    if (state.cat !== 'all' && e.cat !== state.cat) return false;
    if (state.ambi && !e.ambi) return false;
    var kw = state.kw.trim().toLowerCase();
    if (!kw) return true;
    var hay = [e.t, e.full || '', e.zh || '', e.def || '', e.note || '',
               (e.ambi || []).map(function (a) { return a.join(' '); }).join(' ')].join(' ').toLowerCase();
    return hay.indexOf(kw) >= 0;
  }

  function cardHTML(e, i) {
    var kw = state.kw.trim();
    var h = '<article class="gl-card" id="gl-' + i + '" data-cat="' + e.cat + '">';
    h += '<div class="gl-head"><b class="gl-term">' + markText(esc(e.t), kw) + '</b>';
    if (e.ambi) h += '<span class="gl-flag">⚠ 同名不同义</span>';
    h += '<span class="gl-cat">' + CATNAME[e.cat] + '</span></div>';
    var sub = [];
    if (e.full) sub.push(markText(esc(e.full), kw));
    if (e.zh && e.zh !== e.t) sub.push(markText(esc(e.zh), kw));
    if (sub.length) h += '<div class="gl-full">' + sub.join(' · ') + '</div>';
    h += '<p class="gl-def">' + markText(e.def, kw) + '</p>';
    if (e.note) h += '<p class="gl-note"><span class="gl-lb">面试视角</span>' + markText(e.note, kw) + '</p>';
    if (e.ambi) {
      h += '<div class="gl-ambi"><span class="gl-lb">其他领域</span>';
      e.ambi.forEach(function (a) {
        h += '<div class="gl-ambi-item"><b>' + markText(esc(a[0]), kw) + '</b>' + markText(esc(a[1]), kw) + '</div>';
      });
      h += '</div>';
    }
    if (e.cf) h += '<div class="gl-cfrow"><span class="gl-lb">相关</span>' + renderCf(e.cf) + '</div>';
    h += '</article>';
    return h;
  }

  var lettersAll = (function () {
    var seen = {};
    G.entries.forEach(function (e) { seen[letterOf(e.t)] = 1; });
    return Object.keys(seen).sort();
  })();

  function render() {
    var view = [];
    G.entries.forEach(function (e, i) { if (matchEntry(e)) view.push([e, i]); });

    var groups = {}, order = [];
    view.forEach(function (p) {
      var L = letterOf(p[0].t);
      if (!groups[L]) { groups[L] = []; order.push(L); }
      groups[L].push(p);
    });
    order.sort();

    /* 字母索引 */
    var idxHtml = lettersAll.map(function (L) {
      var has = groups[L];
      return '<a class="' + (has ? '' : 'off') + '" data-l="' + L + '">' + L + '</a>';
    }).join('');
    $('#glIdx').innerHTML = idxHtml;

    var html = '';
    order.forEach(function (L) {
      html += '<div class="gl-group" id="glL-' + L + '"><div class="gl-gl">' + L + '</div><div class="gl-gc">';
      groups[L].forEach(function (p) { html += cardHTML(p[0], p[1]); });
      html += '</div></div>';
    });
    $('#content').innerHTML = html;
    $('#empty').style.display = view.length ? 'none' : 'block';

    $('#glTotal').textContent = G.entries.length;
    $('#glVis').textContent = view.length;
    $('#tbCount').textContent = view.length;
  }

  /* ---------- 事件 ---------- */
  var searchEl = $('#search');
  var t = null;
  searchEl.addEventListener('input', function () {
    clearTimeout(t);
    t = setTimeout(function () { state.kw = searchEl.value; render(); }, 120);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement !== searchEl) {
      e.preventDefault(); searchEl.focus();
    } else if (e.key === 'Escape' && document.activeElement === searchEl) {
      searchEl.value = ''; state.kw = ''; render(); searchEl.blur();
    }
  });

  $('#chipRow').addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.cat) {
      state.cat = b.dataset.cat;
      $$('#chipRow [data-cat]').forEach(function (x) { x.classList.toggle('on', x === b); });
    } else if (b.dataset.ambi) {
      state.ambi = !state.ambi;
      b.classList.toggle('on', state.ambi);
    }
    render();
  });

  $('#glIdx').addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    var el = document.getElementById('glL-' + a.dataset.l);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* 相关词跳转：清空筛选 → 定位词条 → 闪烁提示 */
  $('#content').addEventListener('click', function (e) {
    var a = e.target.closest('.gl-cf');
    if (!a) return;
    e.preventDefault();
    var i = +a.dataset.i;
    state.kw = ''; state.cat = 'all'; state.ambi = false;
    searchEl.value = '';
    $$('#chipRow [data-cat]').forEach(function (x) { x.classList.toggle('on', x.dataset.cat === 'all'); });
    $$('#chipRow [data-ambi]').forEach(function (x) { x.classList.remove('on'); });
    render();
    var el = document.getElementById('gl-' + i);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('flash');
      setTimeout(function () { el.classList.remove('flash'); }, 1600);
    }
  });

  var topBtn = $('#topBtn');
  if (topBtn) topBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* 初始化：分类 chips 注入计数、页头易混统计 */
  (function initMeta() {
    var cnt = { all: G.entries.length };
    G.entries.forEach(function (e) { cnt[e.cat] = (cnt[e.cat] || 0) + 1; });
    $$('#chipRow [data-cat]').forEach(function (b) {
      var n = cnt[b.dataset.cat];
      if (n != null) b.insertAdjacentHTML('beforeend', '<i class="cnt">' + n + '</i>');
    });
    var ambiN = G.entries.filter(function (e) { return e.ambi; }).length;
    var glAmbi = $('#glAmbi');
    if (glAmbi) glAmbi.textContent = ambiN;
  })();

  render();
})();
