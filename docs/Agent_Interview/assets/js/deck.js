/* ============================================================
   一题一屏（Deck）：移动端默认、桌面可切换
   - 题卡铺满一屏，纵向滑动一次翻一题（scroll-snap）
   - 顶部条：章节 + 当前序号 + 进度；底部条：上一题 / 显示答案 / 下一题
   - 由 page.js 提供可见题目列表，过滤、搜索后自动重建
   ============================================================ */
(function (g) {
  function $(s) { return document.querySelector(s); }
  /* 容器滚动：老浏览器/无 scrollTo 的环境回退到 scrollTop */
  function scrollIt(el, top, instant) {
    try {
      if (el.scrollTo) el.scrollTo({ top: top, behavior: instant ? 'auto' : 'smooth' });
      else el.scrollTop = top;
    } catch (e) { el.scrollTop = top; }
  }
  /* 底部按钮文案（保留 svg，只改文字节点） */
  function setLabel(btn, text) {
    if (!btn) return;
    var s = btn.querySelector('span');
    if (s) { if (s.textContent !== text) s.textContent = text; }
  }

  var D = {
    on: false,
    visible: [],
    idx: 0,
    root: null,
    cfg: null,
    raf: 0,

    init: function (cfg) {
      D.cfg = cfg;
      D.root = cfg.root;
      D.e = {
        bar: $('#deckBar'), act: $('#deckAct'),
        chap: $('#deckChap'), idx: $('#deckIdx'), prog: $('#deckProg'), read: $('#deckRead'),
        prev: $('#deckPrev'), next: $('#deckNext'), ans: $('#deckAns'),
        toc: $('#deckToc'), exit: $('#deckExit')
      };

      if (D.e.prev) D.e.prev.addEventListener('click', function () { D.go(D.idx - 1); });
      if (D.e.next) D.e.next.addEventListener('click', function () { D.go(D.idx + 1); });
      if (D.e.ans) D.e.ans.addEventListener('click', function () { D.toggle(); });
      if (D.e.toc) D.e.toc.addEventListener('click', function () {
        var t = document.getElementById('drawerToggle');
        if (t) t.click();
        else {
          var sd = document.getElementById('sidebar');
          if (sd) sd.classList.toggle('on');
        }
      });
      if (D.e.exit) D.e.exit.addEventListener('click', function () {
        if (D.cfg.onExit) D.cfg.onExit();
      });

      D.root.addEventListener('scroll', function () {
        if (D.raf) return;
        D.raf = requestAnimationFrame(function () { D.raf = 0; D.detect(); });
      }, { passive: true });

      document.addEventListener('keydown', function (e) {
        if (!D.on) return;
        var t = e.target, tag = t && t.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || (t && t.isContentEditable)) return;
        var k = e.key;
        if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || k === 'j') { e.preventDefault(); D.go(D.idx + 1); }
        else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp' || k === 'k') { e.preventDefault(); D.go(D.idx - 1); }
        else if (k === ' ' || k === 'Enter') { e.preventDefault(); D.toggle(); }
      });

      /* 左右滑动切题（纵向滑仍归滚动/吸附） */
      var sx = 0, sy = 0, st = 0, tracking = false;
      D.root.addEventListener('touchstart', function (e) {
        if (e.touches.length !== 1) { tracking = false; return; }
        sx = e.touches[0].clientX; sy = e.touches[0].clientY; st = Date.now(); tracking = true;
      }, { passive: true });
      D.root.addEventListener('touchend', function (e) {
        if (!tracking) return;
        tracking = false;
        var t = e.changedTouches[0];
        if (!t) return;
        var dx = t.clientX - sx, dy = t.clientY - sy, dt = Date.now() - st;
        if (dt > 700) return;
        if (Math.abs(dx) > 52 && Math.abs(dx) > Math.abs(dy) * 1.6) D.go(D.idx + (dx < 0 ? 1 : -1));
      }, { passive: true });

      /* 鼠标滚轮 / 触控板：一次滚动翻一题。
         答案区本身能滚时先让它滚，滚到顶/底再翻页。 */
      var lastWheel = 0;
      D.root.addEventListener('wheel', function (e) {
        if (!D.on) return;
        var dy = e.deltaY;
        if (!dy || Math.abs(dy) < 2) return;
        var b = e.target && e.target.closest ? e.target.closest('.q-body') : null;
        if (b && b.scrollHeight > b.clientHeight + 2) {
          var atTop = b.scrollTop <= 1;
          var atBottom = b.scrollTop + b.clientHeight >= b.scrollHeight - 2;
          if (dy > 0 ? !atBottom : !atTop) return;
        }
        e.preventDefault();
        var now = Date.now();
        if (now - lastWheel < 300) return;
        lastWheel = now;
        D.go(D.idx + (dy > 0 ? 1 : -1));
      }, { passive: false });

      window.addEventListener('resize', function () { if (D.on) { D.measure(); D.paint(); } });
      window.addEventListener('orientationchange', function () {
        if (D.on) setTimeout(function () { D.measure(); D.paint(); }, 220);
      });
    },

    /* 依据实际顶栏/底栏高度计算卡片高度，避免 dvh 兼容与地址栏抖动 */
    measure: function () {
      if (!D.on) return;
      var tb = document.querySelector('.topbar');
      var db = D.e.bar, da = D.e.act;
      var top = (tb ? tb.offsetHeight : 0) + (db ? db.offsetHeight : 0);
      var bottom = da ? da.offsetHeight : 0;
      var h = Math.max(240, window.innerHeight - top - bottom);
      document.documentElement.style.setProperty('--deck-h', h + 'px');
      document.documentElement.style.setProperty('--card-h', (h - 22) + 'px');
    },

    setVisible: function (list) {
      D.visible = list || [];
      if (D.idx >= D.visible.length) D.idx = D.visible.length - 1;
      if (D.idx < 0) D.idx = 0;
    },

    enable: function (on) {
      D.on = !!on;
      document.documentElement.classList.toggle('deck', D.on);
      /* PC / 移动一致：卡片模式下目录走抽屉，保证 ☰ 始终可用 */
      var side = document.getElementById('sidebar');
      if (side) side.classList.toggle('drawer', D.on);
      if (!on && side) side.classList.remove('on');
      if (D.on) {
        D.measure();
        D.setIdx(D.idx, true);
        D.paint();
      } else {
        document.documentElement.style.removeProperty('--deck-h');
        document.documentElement.style.removeProperty('--card-h');
      }
    },

    /* 定位到第 i 张卡（按当前可见列表） */
    go: function (i, instant) {
      if (!D.visible.length) return;
      if (i < 0) { if (D.cfg.onEdge) D.cfg.onEdge(-1); return; }
      if (i >= D.visible.length) { if (D.cfg.onEdge) D.cfg.onEdge(1); return; }
      var el = D.visible[i]._el;
      if (!el) return;
      var cr = D.root.getBoundingClientRect();
      var rel = el.getBoundingClientRect().top - cr.top;
      scrollIt(D.root, D.root.scrollTop + rel - 1, instant);
      D.idx = i;
      D.paint();
    },

    setIdx: function (i, instant) {
      D.idx = Math.max(0, Math.min(D.visible.length - 1, i));
      var el = D.visible[D.idx]._el;
      if (el) {
        var cr = D.root.getBoundingClientRect();
        var rel = el.getBoundingClientRect().top - cr.top;
        scrollIt(D.root, D.root.scrollTop + rel - 1, instant);
      }
      D.paint();
    },

    /* 按滚动位置判定当前是第几题 */
    detect: function () {
      if (!D.on || !D.visible.length) return;
      var cr = D.root.getBoundingClientRect();
      var half = D.root.clientHeight * 0.5;
      var best = D.idx, bd = Infinity;
      for (var i = 0; i < D.visible.length; i++) {
        var el = D.visible[i]._el;
        if (!el || el.style.display === 'none') continue;
        var rel = el.getBoundingClientRect().top - cr.top;
        var d = Math.abs(rel);
        if (rel < -half) continue;
        if (d < bd) { bd = d; best = i; }
      }
      if (best !== D.idx) { D.idx = best; D.paint(); }
    },

    cur: function () { return D.visible[D.idx] || null; },

    toggle: function () {
      var it = D.cur();
      if (!it) return;
      var open = !it._el.classList.contains('open');
      if (D.cfg.onOpen) D.cfg.onOpen(it, open);
      D.paint();
    },

    /* 刷新顶部/底部条文案与状态 */
    paint: function () {
      if (!D.on) return;
      var it = D.cur();
      var total = D.visible.length;
      if (D.e.idx) D.e.idx.textContent = (total ? D.idx + 1 : 0) + ' / ' + total;
      if (D.e.chap) D.e.chap.textContent = it ? (it.cat || '') : '—';
      if (D.e.prog) {
        var p = total ? (D.idx + 1) / total * 100 : 0;
        D.e.prog.style.width = p.toFixed(2) + '%';
      }
      if (D.e.ans && it) {
        var open = it._el.classList.contains('open');
        setLabel(D.e.ans, open ? '收起答案' : '显示答案');
        D.e.ans.classList.toggle('on', open);
      }
      var first = D.idx <= 0, last = D.idx >= total - 1;
      if (D.e.prev) {
        D.e.prev.classList.toggle('edge', first);
        setLabel(D.e.prev, first ? (D.cfg.prevLabel || '上一题') : '上一题');
      }
      if (D.e.next) {
        D.e.next.classList.toggle('edge', last);
        setLabel(D.e.next, last ? (D.cfg.nextLabel || '下一题') : '下一题');
      }
      if (D.e.read) D.e.read.textContent = D.cfg.readText ? D.cfg.readText() : '';
    },

    /* 卡片展开 / 收起后由 page.js 调用同步按钮状态 */
    sync: function () { if (D.on) D.paint(); }
  };

  g.Deck = D;
})(window);
