/* 分册页渲染：只渲染本分册的模块，答案按需注入；
   阅读进度全自动（打开答案即记入已读）；窄屏默认「一题一屏」。 */
(function () {
  var S = window.Shell;
  var $ = S.$, $$ = S.$$;
  var partId = document.body.dataset.part;
  var part = window.PART_BY_ID[partId];
  if (!part) { document.body.innerHTML = '<p style="padding:40px">未找到分册配置</p>'; return; }

  document.documentElement.dataset.tone = part.tone;
  var content = $('#content'), toc = $('#toc'), plist = $('#plist');

  /* ---------- 数据 ---------- */
  var myCats = window.KB.cats.filter(function (c) { return part.mods.indexOf(c.id) >= 0; })
    .sort(function (a, b) { return part.mods.indexOf(a.id) - part.mods.indexOf(b.id); });
  /* 章节号 = 分册内第几章（01 起）；题号 = 分册内连续编号（001 起）。 */
  var items = [];
  var secMeta = {};
  var n = 0;
  myCats.forEach(function (c, ci) {
    var from = n + 1;
    c.items.forEach(function (it, i) {
      n++;
      items.push({
        uid: c.id + '-' + i,
        n: n,
        q: it.q, a: it.a, tag: it.tag,
        plus: it.plus, warn: it.warn, follow: it.follow,
        why: it.why, num: it.num,
        cat: c.title, catId: c.id, catIdx: c.idx,
        _el: null, _built: false
      });
    });
    secMeta[c.id] = { no: ci + 1, from: from, to: n, count: c.items.length };
  });
  var byUid = {};
  items.forEach(function (it) { byUid[it.uid] = it; });

  function pad(v, len) {
    var s = String(v);
    while (s.length < len) s = '0' + s;
    return s;
  }

  var state = { kw: '', tag: 'all', quiz: false, unreadOnly: false, deck: false };

  /* ---------- 渲染 ---------- */
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function markText(html, kw) {
    if (!kw) return html;
    var re = new RegExp('(' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
    return String(html).split(/(<[^>]+>)/).map(function (seg) {
      return seg.charAt(0) === '<' ? seg : seg.replace(re, '<mark>$1</mark>');
    }).join('');
  }
  function bodyHTML(it) {
    var h = (Array.isArray(it.a) ? it.a : [it.a]).map(function (p) { return '<p>' + p + '</p>'; }).join('');
    if (it.why) h += '<div class="blk why"><span class="lb">解析</span>' + it.why + '</div>';
    if (it.num) h += '<div class="blk num"><span class="lb">判据</span>' + it.num + '</div>';
    if (it.plus) h += '<div class="blk plus"><span class="lb">加分</span>' + it.plus + '</div>';
    if (it.warn) h += '<div class="blk warn"><span class="lb">陷阱</span>' + it.warn + '</div>';
    if (it.follow) h += '<div class="blk follow"><span class="lb">追问</span>' + it.follow + '</div>';
    return h;
  }
  function ensureBody(art, it) {
    if (it._built) return;
    var b = art.querySelector('.q-body');
    if (b) { b.innerHTML = bodyHTML(it); it._built = true; }
  }

  function render() {
    var html = '';
    myCats.forEach(function (c) {
      var m = secMeta[c.id];
      html += '<section class="sec" id="sec-' + c.id + '" data-secno="' + pad(m.no, 2) + '">' +
        '<div class="sec-h">' +
          '<div class="sec-ord">' + pad(m.no, 2) + '</div>' +
          '<div class="sec-txt"><h2>' + c.title + '</h2><p>' + (c.desc || '') + '</p></div>' +
          '<div class="sec-n">' +
            '<span class="pill range">' + pad(m.from, 3) + '–' + pad(m.to, 3) + '</span>' +
            '<span class="pill">' + m.count + ' 题</span>' +
            '<button class="mini-btn sec-expand" data-sec="' + c.id + '">展开本节</button>' +
          '</div>' +
        '</div><div class="q-list">';
      items.forEach(function (it) { if (it.catId === c.id) html += cardHTML(it); });
      html += '</div></section>';
    });
    content.innerHTML = html;
    items.forEach(function (it) { it._el = content.querySelector('[data-uid="' + it.uid + '"]'); it._built = false; });
  }

  function cardHTML(it) {
    return '<article class="item" data-uid="' + it.uid + '" data-tag="' + it.tag + '">' +
      '<div class="q-head">' +
        '<div class="q-num">' + pad(it.n, 3) + '</div>' +
        '<div class="q-main">' +
          '<div class="q-text">' + it.q + '</div>' +
          '<div class="q-meta">' +
            '<span class="q-tag ' + it.tag + '">' + S.tagName(it.tag) + '</span>' +
            '<span class="q-cat">' + it.cat + '</span>' +
            '<span class="q-read">已读</span>' +
          '</div>' +
        '</div>' +
        '<div class="q-side">' +
          '<span class="chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span>' +
        '</div>' +
      '</div>' +
      '<div class="q-body"></div>' +
      '<div class="quiz-mask"><button data-act="reveal">显示答案</button></div>' +
    '</article>';
  }

  function renderToc() {
    toc.innerHTML = myCats.map(function (c) {
      var m = secMeta[c.id];
      return '<a href="#sec-' + c.id + '" data-target="sec-' + c.id + '"><b>' + pad(m.no, 2) + '</b>' +
        '<span>' + c.title + '</span><em>' + m.count + '</em></a>';
    }).join('');
    $$('#toc a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        jumpToCat(a.dataset.target.replace('sec-', ''));
        if (S.closeDrawer) S.closeDrawer();
      });
    });
    S.initSpy(myCats.map(function (c) { return 'sec-' + c.id; }), '#toc');
  }

  /* 目录跳转：列表模式滚到章节，一题一屏模式直接翻到该章第一题 */
  function jumpToCat(catId) {
    if (state.deck) {
      var first = null;
      for (var i = 0; i < items.length; i++) {
        if (items[i].catId === catId && items[i]._el && items[i]._el.style.display !== 'none') { first = items[i]; break; }
      }
      if (first) {
        var vi = visible().indexOf(first);
        if (vi >= 0) { window.Deck.setIdx(vi); return; }
      }
    }
    var t = document.getElementById('sec-' + catId);
    if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 118, behavior: 'smooth' });
  }

  function renderPartList() {
    plist.innerHTML = window.PARTS.map(function (p) {
      return '<a href="' + p.file + '" class="' + (p.id === partId ? 'cur' : '') + '"><i>' + p.no + '</i><span>' + p.title + '</span></a>';
    }).join('');
  }

  function renderNav() {
    var i = window.PARTS.indexOf(part);
    var prev = window.PARTS[i - 1], next = window.PARTS[i + 1];
    var h = '';
    h += prev
      ? '<a class="prev" href="' + prev.file + '"><span class="dir">← 上一分册 ' + prev.no + '</span><b>' + prev.title + '</b></a>'
      : '<a class="prev spacer" href="../index.html"><span class="dir">←</span><b>返回首页</b></a>';
    h += next
      ? '<a class="next" href="' + next.file + '"><span class="dir">下一分册 ' + next.no + ' →</span><b>' + next.title + '</b></a>'
      : '<a class="next" href="../index.html"><span class="dir">返回首页 →</span><b>全部 ' + window.PARTS.length + ' 个分册</b></a>';
    $('#pnav').innerHTML = h;
  }

  /* ---------- 阅读进度（全自动） ---------- */
  var CIRC = 2 * Math.PI * 26;
  function markRead(it) {
    if (!it) return;
    if (S.markRead(it.uid)) {
      if (it._el) it._el.classList.add('done');
      if (state.unreadOnly) filter();
    }
    S.setLast(part.file, it.uid, it.n);
    progress();
    if (window.Deck) window.Deck.sync();
  }
  function progress() {
    var read = S.countRead(items);
    var pct = items.length ? Math.round(read / items.length * 100) : 0;
    var fg = document.getElementById('ringFg');
    if (fg) { fg.setAttribute('stroke-dasharray', CIRC); fg.style.strokeDashoffset = CIRC - CIRC * pct / 100; }
    $('#ringTxt').textContent = pct + '%';
    $('#doneTxt').textContent = read + ' / ' + items.length + ' 题已读';
    $('#allTxt').textContent = '全站已读 ' + S.readTotal() + ' 题';
    var dr = $('#deckRead');
    if (dr) dr.textContent = '已读 ' + read;
  }
  function syncRead() {
    items.forEach(function (it) {
      if (it._el && S.isRead(it.uid)) it._el.classList.add('done');
    });
    progress();
  }

  /* ---------- 过滤 ---------- */
  function visible() {
    return items.filter(function (i) { return i._el && i._el.style.display !== 'none'; });
  }
  function filter() {
    var kw = state.kw.trim().toLowerCase();
    var shown = 0;
    items.forEach(function (it) {
      var el = it._el; if (!el) return;
      var ok = true;
      if (state.tag !== 'all' && it.tag !== state.tag) ok = false;
      if (state.unreadOnly && S.isRead(it.uid)) ok = false;
      if (kw) {
        var hay = (it.q + ' ' + it.cat).toLowerCase();
        if (!it._built) hay += ' ' + (Array.isArray(it.a) ? it.a.join(' ') : it.a).toLowerCase() +
          ' ' + (it.plus || '') + (it.warn || '') + (it.follow || '') + ' ' + (it.why || '') + ' ' + (it.num || '');
        if (hay.indexOf(kw) === -1) ok = false;
      }
      el.style.display = ok ? '' : 'none';
      el.classList.toggle('hit', !!kw && ok);
      if (ok) shown++;
      if (ok && kw) { ensureBody(el, it); el.classList.add('open'); }
      var qt = el.querySelector('.q-text');
      if (qt) qt.innerHTML = kw ? markText(it.q, kw) : it.q;
    });
    myCats.forEach(function (c) {
      var sec = document.getElementById('sec-' + c.id);
      if (!sec) return;
      var vis = items.some(function (i) { return i.catId === c.id && i._el && i._el.style.display !== 'none'; });
      sec.style.display = vis ? '' : 'none';
      var a = toc.querySelector('[data-target="sec-' + c.id + '"]');
      if (a) a.classList.toggle('hide', !vis);
    });
    $('#empty').style.display = shown ? 'none' : 'block';
    $('#tbVis').textContent = shown;
    if (state.deck && window.Deck) {
      window.Deck.setVisible(visible());
      window.Deck.setIdx(0, true);
    }
  }

  /* ---------- 一题一屏 ---------- */
  var pi = window.PARTS.indexOf(part);
  var prevPart = window.PARTS[pi - 1] || null;
  var nextPart = window.PARTS[pi + 1] || null;
  function openCard(it, open) {
    if (!it || !it._el) return;
    it._el.classList.toggle('open', open);
    if (open) { ensureBody(it._el, it); markRead(it); }
    if (state.deck && window.Deck) window.Deck.sync();
  }
  function setDeck(on) {
    state.deck = !!on;
    if (window.Deck) {
      window.Deck.setVisible(visible());
      window.Deck.enable(state.deck);
    }
    var b = $('#btnDeck');
    if (b) {
      b.classList.toggle('on', state.deck);
      b.textContent = state.deck ? '列表模式' : '一题一屏';
    }
    if (state.deck) {
      var last = S.getLast();
      var vi = 0;
      if (last && last.f === part.file && byUid[last.u]) {
        var k = visible().indexOf(byUid[last.u]);
        if (k >= 0) vi = k;
      } else {
        /* 默认停在第一个未读的题上 */
        var v = visible();
        for (var i = 0; i < v.length; i++) { if (!S.isRead(v[i].uid)) { vi = i; break; } }
      }
      if (window.Deck) window.Deck.setIdx(vi, true);
      S.toast(S.isNarrow()
        ? '一题一屏：上下滑动翻题，点「显示答案」自动记入已读'
        : '卡片模式：滚轮或 ←/→ 翻题，空格展开答案，☰ 打开目录');
    }
  }

  /* ---------- 交互 ---------- */
  content.addEventListener('click', function (e) {
    var rv = e.target.closest('[data-act="reveal"]');
    if (rv) {
      var art2 = rv.closest('.item');
      var it2 = byUid[art2.dataset.uid];
      ensureBody(art2, it2);
      art2.querySelector('.q-body').classList.add('reveal');
      rv.parentElement.style.display = 'none';
      markRead(it2);
      return;
    }
    var ex = e.target.closest('.sec-expand');
    if (ex) {
      var sec = document.getElementById('sec-' + ex.dataset.sec);
      var open = sec.dataset.open === '1';
      items.forEach(function (i) {
        if (i.catId !== ex.dataset.sec || !i._el) return;
        i._el.classList.toggle('open', !open);
        if (!open) ensureBody(i._el, i);
      });
      sec.dataset.open = open ? '0' : '1';
      ex.textContent = open ? '展开本节' : '收起本节';
      return;
    }
    var head = e.target.closest('.q-head');
    if (head) {
      if (window.getSelection().toString()) return;
      var art3 = head.closest('.item');
      var it3 = byUid[art3.dataset.uid];
      openCard(it3, !art3.classList.contains('open'));
    }
  });

  $('#search').addEventListener('input', function (e) { state.kw = e.target.value; filter(); });
  S.initKeys($('#search'), function () { state.kw = ''; filter(); });

  $$('#chipRow .chip').forEach(function (c) {
    c.addEventListener('click', function () {
      $$('#chipRow .chip').forEach(function (x) { x.classList.remove('on'); });
      c.classList.add('on');
      state.tag = c.dataset.tag;
      filter();
    });
  });

  $('#btnQuiz').addEventListener('click', function () {
    state.quiz = !state.quiz;
    document.querySelector('.pgrid').classList.toggle('mode-quiz', state.quiz);
    this.classList.toggle('on', state.quiz);
    this.textContent = state.quiz ? '退出背诵' : '背诵模式';
    S.toast(state.quiz ? '背诵模式：先自己答，再点「显示答案」' : '已退出背诵模式');
  });

  $('#btnExpand').addEventListener('click', function () {
    var on = this.dataset.on !== '1';
    this.dataset.on = on ? '1' : '0';
    items.forEach(function (i) {
      if (!i._el || i._el.style.display === 'none') return;
      i._el.classList.toggle('open', on);
      if (on) ensureBody(i._el, i);
      if (on) markRead(i);
    });
    myCats.forEach(function (c) {
      var sec = document.getElementById('sec-' + c.id); if (!sec) return;
      sec.dataset.open = on ? '1' : '0';
      var b = sec.querySelector('.sec-expand'); if (b) b.textContent = on ? '收起本节' : '展开本节';
    });
    this.textContent = on ? '收起全部' : '展开全部';
    S.toast(on ? '已展开本册全部答案，并计入已读' : '已收起全部答案');
    if (state.deck && window.Deck) window.Deck.sync();
  });

  $('#btnUnread').addEventListener('click', function () {
    state.unreadOnly = !state.unreadOnly;
    this.classList.toggle('on', state.unreadOnly);
    filter();
    S.toast(state.unreadOnly ? '只看还没读过的题' : '显示全部题目');
  });

  if ($('#btnDeck')) {
    $('#btnDeck').addEventListener('click', function () {
      S.setDeckPref(!state.deck);
      setDeck(!state.deck);
    });
  }

  $('#topBtn').addEventListener('click', function () {
    if (state.deck && window.Deck) window.Deck.setIdx(0);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  $('#resetBtn').addEventListener('click', function () {
    if (!confirm('清空全部已读记录？（全站记录都会一起清空）')) return;
    S.store = {}; S.save(); S.clearLast();
    items.forEach(function (i) { if (i._el) i._el.classList.remove('done'); });
    progress(); filter();
  });

  /* ---------- 定位到具体题目 ---------- */
  function jump() {
    var h = location.hash || '';
    var m = /uid=([^&]+)/.exec(h);
    if (m) {
      var it = byUid[decodeURIComponent(m[1])];
      if (it && it._el) {
        ensureBody(it._el, it);
        it._el.classList.add('open');
        markRead(it);
        setTimeout(function () {
          if (state.deck && window.Deck) {
            var vi = visible().indexOf(it);
            if (vi >= 0) window.Deck.setIdx(vi, true);
          } else {
            window.scrollTo({ top: it._el.getBoundingClientRect().top + window.scrollY - 130, behavior: 'smooth' });
          }
          it._el.style.boxShadow = '0 0 0 3px var(--accent)';
          setTimeout(function () { it._el.style.boxShadow = ''; }, 1600);
        }, 60);
      }
      return;
    }
    var sm = /^#sec-(.+)$/.exec(h);
    if (sm) jumpToCat(sm[1]);
  }

  /* ---------- 启动 ---------- */
  S.init();
  var ptNo = document.querySelector('.pt-no');
  if (ptNo) {
    ptNo.textContent = 'PART ' + part.no + ' / ' + pad(window.PARTS.length, 2) +
      ' · ' + pad(myCats.length, 2) + ' 章 · ' + items.length + ' 题 · 编号 ' +
      pad(1, 3) + '–' + pad(items.length, 3);
  }
  render();
  renderToc();
  renderPartList();
  renderNav();
  syncRead();
  $('#tbCount').textContent = items.length;

  if (window.Deck) {
    window.Deck.init({
      root: content,
      onOpen: openCard,
      readText: function () { return '已读 ' + S.countRead(items); },
      onExit: function () { S.setDeckPref(false); setDeck(false); },
      prevLabel: prevPart ? '上一册' : '回到首页',
      nextLabel: nextPart ? '下一册' : '回到首页',
      onEdge: function (dir) {
        var t = dir > 0 ? nextPart : prevPart;
        if (t) {
          S.toast(dir > 0 ? '本册读完，进入 ' + t.no + ' ' + t.title : '返回 ' + t.no + ' ' + t.title);
          setTimeout(function () { location.href = t.file; }, 460);
        } else {
          S.toast(dir > 0 ? '已经是最后一个分册' : '已经是第一个分册');
          setTimeout(function () { location.href = '../index.html'; }, 700);
        }
      }
    });
  }

  filter();
  var pref = S.deckPref();
  setDeck(pref === null ? S.isNarrow() : pref);
  if (pref === null && state.deck) S.setDeckPref(true);
  jump();
  window.addEventListener('hashchange', jump);
})();
