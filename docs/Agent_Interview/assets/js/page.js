/* 分册页渲染（分层动态渲染版）
   - 列表模式：按章节筛选 + 每页只渲染 24 题，章节切换/翻页才重建 DOM
   - 卡片模式：整页只有 1 张题卡的真实 DOM，翻题即重建
   - 答案一律懒注入（点开才生成 HTML，并缓存）
   - 阅读进度全自动：点开答案即记入已读 */
(function () {
  var S = window.Shell, $ = S.$, $$ = S.$$;
  var partId = document.body.dataset.part;
  var part = window.PART_BY_ID[partId];
  if (!part) { document.body.innerHTML = '<p style="padding:40px">未找到分册配置</p>'; return; }
  document.documentElement.dataset.tone = part.tone;

  var content = $('#content'), stage = $('#stage'), toc = $('#toc'), plist = $('#plist');
  var PAGE = 24;

  /* ---------- 数据：只建轻量对象，不碰 DOM ---------- */
  var myCats = window.KB.cats.filter(function (c) { return part.mods.indexOf(c.id) >= 0; })
    .sort(function (a, b) { return part.mods.indexOf(a.id) - part.mods.indexOf(b.id); });
  var items = [], secs = [], secById = {}, byUid = {};
  var n = 0;
  myCats.forEach(function (c, ci) {
    var from = n + 1;
    c.items.forEach(function (it, i) {
      n++;
      var o = {
        uid: c.id + '-' + i, n: n, q: it.q, a: it.a, tag: it.tag,
        plus: it.plus, warn: it.warn, follow: it.follow, why: it.why, num: it.num,
        cat: c.title, catId: c.id, _body: null, _el: null
      };
      items.push(o); byUid[o.uid] = o;
    });
    var s = { id: c.id, title: c.title, desc: c.desc || '', no: ci + 1, from: from, to: n, count: c.items.length };
    secs.push(s); secById[c.id] = s;
  });

  var state = { kw: '', tag: 'all', quiz: false, unread: false, sec: 'all', page: 1, one: false };
  var view = items.slice();
  var oneIdx = 0;

  function pad(v, len) { var s = String(v); while (s.length < len) s = '0' + s; return s; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function markText(html, kw) {
    if (!kw) return html;
    var re = new RegExp('(' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
    return String(html).split(/(<[^>]+>)/).map(function (seg) {
      return seg.charAt(0) === '<' ? seg : seg.replace(re, '<mark>$1</mark>');
    }).join('');
  }

  /* ---------- 答案（懒生成 + 缓存） ---------- */
  function bodyHTML(it) {
    var h = (Array.isArray(it.a) ? it.a : [it.a]).map(function (p) { return '<p>' + p + '</p>'; }).join('');
    if (it.why) h += '<div class="blk why"><span class="lb">解析</span>' + it.why + '</div>';
    if (it.num) h += '<div class="blk num"><span class="lb">判据</span>' + it.num + '</div>';
    if (it.plus) h += '<div class="blk plus"><span class="lb">加分</span>' + it.plus + '</div>';
    if (it.warn) h += '<div class="blk warn"><span class="lb">陷阱</span>' + it.warn + '</div>';
    if (it.follow) h += '<div class="blk follow"><span class="lb">追问</span>' + it.follow + '</div>';
    return h;
  }
  function fullText(it) {
    return (Array.isArray(it.a) ? it.a.join(' ') : it.a) + ' ' +
      (it.plus || '') + ' ' + (it.warn || '') + ' ' + (it.follow || '') + ' ' +
      (it.why || '') + ' ' + (it.num || '');
  }
  function inject(el, it) {
    var b = el.querySelector('.q-body');
    if (!b || b.innerHTML) return;
    if (!it._body) it._body = bodyHTML(it);
    b.innerHTML = it._body;
  }

  /* ---------- 卡片 ---------- */
  function cardHTML(it) {
    var kw = state.kw.trim();
    return '<article class="item" data-uid="' + it.uid + '" data-tag="' + it.tag + '">' +
      '<div class="q-head">' +
        '<div class="q-num">' + pad(it.n, 3) + '</div>' +
        '<div class="q-main">' +
          '<div class="q-text">' + (kw ? markText(it.q, kw) : it.q) + '</div>' +
          '<div class="q-meta">' +
            '<span class="q-tag ' + it.tag + '">' + S.tagName(it.tag) + '</span>' +
            '<span class="q-cat">' + it.cat + '</span>' +
            '<span class="q-read">已读</span>' +
          '</div>' +
        '</div>' +
        '<span class="chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span>' +
      '</div>' +
      '<div class="q-body"></div>' +
      '<div class="quiz-mask"><button data-act="reveal">显示答案</button></div>' +
    '</article>';
  }
  function secHeadHTML(s) {
    return '<div class="sec-h">' +
      '<div class="sec-ord">' + pad(s.no, 2) + '</div>' +
      '<div class="sec-txt"><h2>' + s.title + '</h2><p>' + s.desc + '</p></div>' +
      '<div class="sec-n">' +
        '<span class="pill range">' + pad(s.from, 3) + '–' + pad(s.to, 3) + '</span>' +
        '<span class="pill">' + s.count + ' 题</span>' +
        '<button class="mini-btn sec-expand" data-sec="' + s.id + '">展开本节</button>' +
      '</div></div>';
  }

  /* ---------- 过滤与视图 ---------- */
  var kwLower = '';
  function rebuild() {
    kwLower = state.kw.trim().toLowerCase();
    view = items.filter(function (it) {
      if (state.tag !== 'all' && it.tag !== state.tag) return false;
      if (state.unread && S.isRead(it.uid)) return false;
      if (state.sec !== 'all' && it.catId !== state.sec) return false;
      if (kwLower) {
        var hay = (it.q + ' ' + it.cat).toLowerCase();
        if (!it._body) hay += ' ' + fullText(it).toLowerCase();
        if (hay.indexOf(kwLower) === -1) return false;
      }
      return true;
    });
    var pages = Math.max(1, Math.ceil(view.length / PAGE));
    if (state.page > pages) state.page = pages;
    if (oneIdx >= view.length) oneIdx = Math.max(0, view.length - 1);
  }
  function resetFilters() {
    state.kw = ''; state.tag = 'all'; state.unread = false; state.sec = 'all'; state.page = 1;
    var inp = $('#search'); if (inp) inp.value = '';
    $$('#chipRow .chip').forEach(function (c) { c.classList.toggle('on', c.dataset.tag === 'all'); });
    var u = $('#btnUnread'); if (u) u.classList.remove('on');
    syncSegNav();
    rebuild();
  }

  /* ---------- 列表模式 ---------- */
  function renderList() {
    var pages = Math.max(1, Math.ceil(view.length / PAGE));
    if (state.page > pages) state.page = pages;
    var from = (state.page - 1) * PAGE;
    var slice = view.slice(from, from + PAGE);
    var html = '';
    if (state.sec === 'all') {
      html += '<div class="list-head"><b>本册全部题目</b>' +
        '<span>第 ' + state.page + ' / ' + pages + ' 页 · 共 ' + view.length + ' 题</span></div>';
      html += '<div class="q-list">' + slice.map(cardHTML).join('') + '</div>';
    } else {
      var s = secById[state.sec];
      html += '<section class="sec" id="sec-' + s.id + '">' + secHeadHTML(s) +
        '<div class="q-list">' + slice.map(cardHTML).join('') + '</div></section>';
      if (pages > 1) {
        html += '<div class="list-head sub"><b>' + s.title + '（续）</b>' +
          '<span>第 ' + state.page + ' / ' + pages + ' 页</span></div>';
      }
    }
    content.innerHTML = html;
    slice.forEach(function (it) {
      it._el = content.querySelector('[data-uid="' + it.uid + '"]');
      if (!it._el) return;
      if (S.isRead(it.uid)) it._el.classList.add('done');
      if (kwLower) { inject(it._el, it); it._el.classList.add('open'); }
    });
    $('#empty').style.display = view.length ? 'none' : 'block';
    $('#tbVis').textContent = view.length;
    renderPager(pages);
  }
  function renderPager(pages) {
    var p = $('#pager');
    if (!p) return;
    if (pages <= 1) { p.style.display = 'none'; return; }
    p.style.display = '';
    p.innerHTML =
      '<button class="mini-btn" data-page="' + (state.page - 1) + '"' + (state.page <= 1 ? ' disabled' : '') + '>上一页</button>' +
      '<span class="pg-txt">第 ' + state.page + ' / ' + pages + ' 页</span>' +
      '<button class="mini-btn" data-page="' + (state.page + 1) + '"' + (state.page >= pages ? ' disabled' : '') + '>下一页</button>';
  }
  function renderSegNav() {
    var box = $('#segNav');
    if (!box) return;
    box.innerHTML = ['all'].concat(secs.map(function (s) { return s.id; })).map(function (id) {
      if (id === 'all') return '<button class="chip" data-sec="all">全部 ' + items.length + '</button>';
      var s = secById[id];
      return '<button class="chip" data-sec="' + id + '">' + pad(s.no, 2) + ' ' + s.title + ' · ' + s.count + '</button>';
    }).join('');
    syncSegNav();
    $$('#segNav .chip').forEach(function (c) {
      c.addEventListener('click', function () {
        state.sec = c.dataset.sec; state.page = 1;
        rebuild(); renderList();
      });
    });
  }
  function syncSegNav() {
    $$('#segNav .chip').forEach(function (c) { c.classList.toggle('on', c.dataset.sec === state.sec); });
  }

  /* ---------- 卡片模式：整页只有 1 张卡 ---------- */
  function renderOne() {
    var it = view[oneIdx];
    if (!it) {
      stage.innerHTML = '<div class="one-empty">没有可显示的题目</div>';
      paint();
      return;
    }
    stage.innerHTML = cardHTML(it);
    stage.scrollTop = 0;
    it._el = stage.firstElementChild;
    if (S.isRead(it.uid)) it._el.classList.add('done');
    S.setLast(part.file, it.uid, it.n);
    paint();
  }
  function setLabel(btn, text) {
    if (!btn) return;
    var s = btn.querySelector('span');
    if (s && s.textContent !== text) s.textContent = text;
  }
  function paint() {
    var it = view[oneIdx], total = view.length;
    var el = $('#deckIdx'); if (el) el.textContent = (total ? oneIdx + 1 : 0) + ' / ' + total;
    var ch = $('#deckChap'); if (ch) ch.textContent = it ? it.cat : '—';
    var pg = $('#deckProg'); if (pg) pg.style.width = (total ? (oneIdx + 1) / total * 100 : 0).toFixed(2) + '%';
    var ans = $('#deckAns');
    if (ans && it) {
      var open = it._el && it._el.classList.contains('open');
      setLabel(ans, open ? '收起答案' : '显示答案');
      ans.classList.toggle('on', open);
    }
    var prev = $('#deckPrev'), next = $('#deckNext');
    var first = oneIdx <= 0, last = oneIdx >= total - 1;
    if (prev) { prev.classList.toggle('edge', first); setLabel(prev, first ? prevLabel() : '上一题'); }
    if (next) { next.classList.toggle('edge', last); setLabel(next, last ? nextLabel() : '下一题'); }
  }
  function go(i) {
    if (!view.length) return;
    if (i < 0) { edge(-1); return; }
    if (i >= view.length) { edge(1); return; }
    oneIdx = i;
    renderOne();
  }

  /* ---------- 阅读进度（全自动） ---------- */
  var CIRC = 2 * Math.PI * 26;
  function markRead(it) {
    if (!it) return;
    if (S.markRead(it.uid) && it._el) it._el.classList.add('done');
    S.setLast(part.file, it.uid, it.n);
    progress();
  }
  function progress() {
    var read = S.countRead(items);
    var pct = items.length ? Math.round(read / items.length * 100) : 0;
    var fg = document.getElementById('ringFg');
    if (fg) { fg.setAttribute('stroke-dasharray', CIRC); fg.style.strokeDashoffset = CIRC - CIRC * pct / 100; }
    $('#ringTxt').textContent = pct + '%';
    $('#doneTxt').textContent = read + ' / ' + items.length + ' 题已读';
    $('#allTxt').textContent = '全站已读 ' + S.readTotal() + ' 题';
    var dr = $('#deckRead'); if (dr) dr.textContent = '已读 ' + read;
  }

  function openCard(it, open) {
    if (!it || !it._el) return;
    it._el.classList.toggle('open', open);
    if (open) {
      inject(it._el, it);
      /* 背诵模式下答案默认隐藏，展开时要显式放行，否则点了也看不见 */
      if (state.quiz) {
        var b = it._el.querySelector('.q-body');
        if (b) b.classList.add('reveal');
        var mk = it._el.querySelector('.quiz-mask');
        if (mk) mk.style.display = 'none';
      }
      markRead(it);
    }
    if (state.one) paint();
  }

  /* ---------- 分册间导航 ---------- */
  var pi = window.PARTS.indexOf(part);
  var prevPart = window.PARTS[pi - 1] || null, nextPart = window.PARTS[pi + 1] || null;
  function prevLabel() { return prevPart ? '上一册' : '回首页'; }
  function nextLabel() { return nextPart ? '下一册' : '回首页'; }
  function edge(dir) {
    var t = dir > 0 ? nextPart : prevPart;
    if (t) {
      S.toast(dir > 0 ? '本册读完，进入 ' + t.no + ' ' + t.title : '返回 ' + t.no + ' ' + t.title);
      setTimeout(function () { location.href = t.file; }, 420);
    } else {
      S.toast(dir > 0 ? '已经是最后一个分册' : '已经是第一个分册');
      setTimeout(function () { location.href = '../index.html'; }, 700);
    }
  }

  /* ---------- 模式切换 ---------- */
  function setOne(on) {
    state.one = !!on;
    document.documentElement.classList.toggle('one', state.one);
    var side = $('#sidebar');
    if (side) side.classList.remove('on');
    var b = $('#btnDeck');
    if (b) { b.classList.toggle('on', state.one); b.textContent = state.one ? '列表模式' : '卡片模式'; }
    if (state.one) {
      content.innerHTML = '';          /* 释放列表 DOM，卡片模式下不保留几十张卡 */
      var last = S.getLast(), vi = 0;
      if (last && last.f === part.file && byUid[last.u]) {
        var k = view.indexOf(byUid[last.u]);
        if (k >= 0) vi = k;
      } else {
        for (var i = 0; i < view.length; i++) { if (!S.isRead(view[i].uid)) { vi = i; break; } }
      }
      oneIdx = vi;
      renderOne();
      S.toast(S.isNarrow()
        ? '卡片模式：左右滑或点底部按钮翻题，点「显示答案」自动记入已读'
        : '卡片模式：滚轮或 ←/→ 翻题，空格展开答案');
    } else {
      stage.innerHTML = '';
      renderList();
    }
  }

  /* ---------- 事件（委托，两个模式共用同一套处理） ---------- */
  function onCardClick(e) {
    var rv = e.target.closest('[data-act="reveal"]');
    if (rv) {
      var art = rv.closest('.item'), it = byUid[art.dataset.uid];
      inject(art, it);
      art.querySelector('.q-body').classList.add('reveal');
      rv.parentElement.style.display = 'none';
      markRead(it);
      if (state.one) paint();
      return;
    }
    var ex = e.target.closest('.sec-expand');
    if (ex) {
      var open = true;
      $$('#content .item').forEach(function (el) {
        var it2 = byUid[el.dataset.uid];
        if (!it2) return;
        if (!el.classList.contains('open')) open = false;
      });
      $$('#content .item').forEach(function (el) {
        var it2 = byUid[el.dataset.uid];
        if (!it2) return;
        el.classList.toggle('open', !open);
        if (!open) { inject(el, it2); markRead(it2); }
      });
      ex.textContent = open ? '展开本节' : '收起本节';
      return;
    }
    var head = e.target.closest('.q-head');
    if (head) {
      if (window.getSelection().toString()) return;
      var a2 = head.closest('.item');
      openCard(byUid[a2.dataset.uid], !a2.classList.contains('open'));
    }
  }
  content.addEventListener('click', onCardClick);
  stage.addEventListener('click', onCardClick);

  /* ---------- 顶部/侧栏交互 ---------- */
  $('#search').addEventListener('input', function (e) {
    state.kw = e.target.value;
    state.page = 1;
    rebuild();
    if (state.one) { oneIdx = 0; renderOne(); } else renderList();
  });
  S.initKeys($('#search'), function () {
    state.kw = ''; state.page = 1; rebuild();
    if (state.one) renderOne(); else renderList();
  });

  $$('#chipRow .chip').forEach(function (c) {
    c.addEventListener('click', function () {
      $$('#chipRow .chip').forEach(function (x) { x.classList.remove('on'); });
      c.classList.add('on');
      state.tag = c.dataset.tag;
      state.page = 1;
      rebuild();
      if (state.one) { oneIdx = 0; renderOne(); } else renderList();
    });
  });

  $('#btnQuiz').addEventListener('click', function () {
    state.quiz = !state.quiz;
    document.body.classList.toggle('mode-quiz', state.quiz);
    this.classList.toggle('on', state.quiz);
    this.textContent = state.quiz ? '退出背诵' : '背诵模式';
    S.toast(state.quiz ? '背诵模式：先自己答，再点「显示答案」' : '已退出背诵模式');
  });

  $('#btnExpand').addEventListener('click', function () {
    var on = this.dataset.on !== '1';
    this.dataset.on = on ? '1' : '0';
    $$('#content .item').forEach(function (el) {
      var it = byUid[el.dataset.uid];
      if (!it) return;
      el.classList.toggle('open', on);
      if (on) { inject(el, it); markRead(it); }
    });
    this.textContent = on ? '收起本页' : '展开本页';
    S.toast(on ? '已展开本页答案，并计入已读' : '已收起本页答案');
  });

  $('#btnUnread').addEventListener('click', function () {
    state.unread = !state.unread;
    this.classList.toggle('on', state.unread);
    state.page = 1;
    rebuild();
    if (state.one) { oneIdx = 0; renderOne(); } else renderList();
    S.toast(state.unread ? '只看还没读过的题' : '显示全部题目');
  });

  $('#btnDeck').addEventListener('click', function () {
    S.setDeckPref(!state.one);
    setOne(!state.one);
  });

  $('#topBtn').addEventListener('click', function () {
    if (state.one) go(0);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  $('#resetBtn').addEventListener('click', function () {
    if (!confirm('清空全部已读记录？（全站记录都会一起清空）')) return;
    S.store = {}; S.save(); S.clearLast();
    items.forEach(function (i) { if (i._el) i._el.classList.remove('done'); });
    state.page = 1; rebuild();
    if (state.one) renderOne(); else renderList();
    progress();
  });

  /* 卡片模式按钮与手势 */
  $('#deckPrev').addEventListener('click', function () {
    if (oneIdx <= 0) { edge(-1); return; }
    go(oneIdx - 1);
  });
  $('#deckNext').addEventListener('click', function () {
    if (oneIdx >= view.length - 1) { edge(1); return; }
    go(oneIdx + 1);
  });
  $('#deckAns').addEventListener('click', function () {
    var it = view[oneIdx];
    if (!it || !it._el) return;
    openCard(it, !it._el.classList.contains('open'));
  });
  $('#deckToc').addEventListener('click', function () {
    var t = $('#drawerToggle');
    if (t) t.click();
    else { var sd = $('#sidebar'); if (sd) sd.classList.toggle('on'); }
  });
  $('#deckExit').addEventListener('click', function () { S.setDeckPref(false); setOne(false); });

  document.addEventListener('keydown', function (e) {
    if (!state.one) return;
    var t = e.target, tag = t && t.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || (t && t.isContentEditable)) return;
    var k = e.key;
    if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown') { e.preventDefault(); go(oneIdx + 1); }
    else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') { e.preventDefault(); go(oneIdx - 1); }
    else if (k === ' ' || k === 'Enter') {
      e.preventDefault();
      var it = view[oneIdx];
      if (it && it._el) openCard(it, !it._el.classList.contains('open'));
    }
  });

  /* 滚轮：一次滚动翻一题；答案区能滚时先滚答案区 */
  var lastWheel = 0;
  stage.addEventListener('wheel', function (e) {
    if (!state.one) return;
    var dy = e.deltaY;
    if (!dy || Math.abs(dy) < 2) return;
    /* 内容能滚时先滚内容，滚到顶/底再翻题 —— 长答案不会被跳过 */
    if (stage.scrollHeight > stage.clientHeight + 2) {
      var atTop = stage.scrollTop <= 1, atBottom = stage.scrollTop + stage.clientHeight >= stage.scrollHeight - 2;
      if (dy > 0 ? !atBottom : !atTop) return;
    }
    e.preventDefault();
    var now = Date.now();
    if (now - lastWheel < 280) return;
    lastWheel = now;
    go(oneIdx + (dy > 0 ? 1 : -1));
  }, { passive: false });

  /* 触摸：左右滑翻题，短距上下滑也翻题 */
  var sx = 0, sy = 0, st = 0, track = false;
  stage.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) { track = false; return; }
    sx = e.touches[0].clientX; sy = e.touches[0].clientY; st = Date.now(); track = true;
  }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (!track || !state.one) return;
    track = false;
    var t = e.changedTouches[0];
    if (!t) return;
    var dx = t.clientX - sx, dy = t.clientY - sy, dt = Date.now() - st;
    if (dt > 800) return;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) { go(oneIdx + (dx < 0 ? 1 : -1)); return; }
    /* 上下滑：内容已经溢出可滚时交给滚动，否则上下滑翻题 */
    if (stage.scrollHeight <= stage.clientHeight + 2 && Math.abs(dy) > 70 && Math.abs(dy) > Math.abs(dx)) {
      go(oneIdx + (dy < 0 ? 1 : -1));
    }
  }, { passive: true });

  /* 分页器 */
  $('#pager').addEventListener('click', function (e) {
    var b = e.target.closest('[data-page]');
    if (!b) return;
    var p = parseInt(b.dataset.page, 10);
    var pages = Math.max(1, Math.ceil(view.length / PAGE));
    if (p < 1 || p > pages) return;
    state.page = p;
    renderList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- 目录 / 分册列表 / 上下册 ---------- */
  function jumpToCat(catId) {
    if (state.one) {
      for (var i = 0; i < view.length; i++) { if (view[i].catId === catId) { go(i); return; } }
      S.toast('当前筛选下没有该章节的题');
      return;
    }
    state.sec = catId; state.page = 1;
    rebuild(); renderList();
    var t = document.getElementById('sec-' + catId);
    if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 118, behavior: 'smooth' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  toc.innerHTML = secs.map(function (s) {
    return '<a href="#sec-' + s.id + '" data-target="' + s.id + '"><b>' + pad(s.no, 2) + '</b>' +
      '<span>' + s.title + '</span><em>' + s.count + '</em></a>';
  }).join('');
  $$('#toc a').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); jumpToCat(a.dataset.target); if (S.closeDrawer) S.closeDrawer(); });
  });
  plist.innerHTML = window.PARTS.map(function (p) {
    return '<a href="' + p.file + '" class="' + (p.id === partId ? 'cur' : '') + '"><i>' + p.no + '</i><span>' + p.title + '</span></a>';
  }).join('');
  $('#pnav').innerHTML =
    (prevPart ? '<a class="prev" href="' + prevPart.file + '"><span class="dir">← 上一分册 ' + prevPart.no + '</span><b>' + prevPart.title + '</b></a>'
              : '<a class="prev spacer" href="../index.html"><span class="dir">←</span><b>返回首页</b></a>') +
    (nextPart ? '<a class="next" href="' + nextPart.file + '"><span class="dir">下一分册 ' + nextPart.no + ' →</span><b>' + nextPart.title + '</b></a>'
              : '<a class="next" href="../index.html"><span class="dir">返回首页 →</span><b>全部 ' + window.PARTS.length + ' 个分册</b></a>');

  /* ---------- 定位 ---------- */
  function locate(uid) {
    var it = byUid[uid];
    if (!it) return;
    if (view.indexOf(it) < 0) { resetFilters(); rebuild(); }
    if (state.one) {
      var i = view.indexOf(it);
      if (i >= 0) { oneIdx = i; renderOne(); openCard(it, true); }
      return;
    }
    var idx = view.indexOf(it);
    if (idx < 0) return;
    state.page = Math.floor(idx / PAGE) + 1;
    if (state.sec !== 'all' && it.catId !== state.sec) { state.sec = 'all'; syncSegNav(); rebuild(); }
    renderList();
    var el = content.querySelector('[data-uid="' + uid + '"]');
    if (el) {
      openCard(it, true);
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      el.classList.add('hit');
      setTimeout(function () { el.classList.remove('hit'); }, 1800);
    }
  }
  function jump() {
    var h = location.hash || '';
    var m = /uid=([^&]+)/.exec(h);
    if (m) { locate(decodeURIComponent(m[1])); return; }
    var sm = /^#sec-(.+)$/.exec(h);
    if (sm) jumpToCat(sm[1]);
  }

  /* ---------- 启动 ---------- */
  S.init();
  var ptNo = document.querySelector('.pt-no');
  if (ptNo) {
    ptNo.textContent = 'PART ' + part.no + ' / ' + pad(window.PARTS.length, 2) +
      ' · ' + pad(secs.length, 2) + ' 章 · ' + items.length + ' 题 · 编号 ' + pad(1, 3) + '–' + pad(items.length, 3);
  }
  $('#tbCount').textContent = items.length;
  renderSegNav();
  rebuild();
  progress();
  var pref = S.deckPref();
  setOne(pref === null ? S.isNarrow() : pref);
  if (pref === null && state.one) S.setDeckPref(true);
  jump();
  window.addEventListener('hashchange', jump);
})();
