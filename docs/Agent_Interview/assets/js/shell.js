/* 共享外壳：安全存储、主题、字号、进度、轻提示、滚动进度、目录/抽屉 */
(function (g) {
  var KEY = 'agent-kb-progress-2026';
  var THEME = 'agent-kb-theme';
  /* v2：旧 key 曾被自动模式误写（窄屏访问一次后 PC 永久卡片模式），换 key 让脏数据失效 */
  var DECKKEY = 'agent-kb-deck2';
  var LASTKEY = 'agent-kb-last';
  var mem = {};

  /* localStorage 在 file:// 或隐私模式下可能抛异常，降级到内存存储 */
  var LS = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return mem[k] || null; } },
    set: function (k, v) { mem[k] = v; try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };

  var store = {};
  try { store = JSON.parse(LS.get(KEY) || '{}') || {}; } catch (e) { store = {}; }

  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return [].slice.call(document.querySelectorAll(s)); };

  var Shell = {
    KEY: KEY, LS: LS, $: $, $$: $$,
    store: store,
    TAG: { base: '基础', adv: '进阶', deep: '深水', hot: '热点' },
    tagName: function (t) { return Shell.TAG[t] || '进阶'; },

    save: function () { LS.set(KEY, JSON.stringify(store)); },

    /* —— 阅读状态：只要打开过答案就自动记入已读，无需手动标记 —— */
    isRead: function (uid) { return !!store[uid]; },
    isDone: function (uid) { return !!store[uid]; },
    markRead: function (uid) {
      if (store[uid]) return false;
      store[uid] = 1;
      Shell.save();
      return true;
    },
    setDone: function (uid, v) {
      if (v) store[uid] = 1; else delete store[uid];
      Shell.save();
    },
    countRead: function (items) {
      return items.filter(function (i) { return store[i.uid]; }).length;
    },
    countDone: function (items) { return Shell.countRead(items); },
    readTotal: function () { return Object.keys(store).length; },

    /* 上次阅读到的一题，用于首页「继续上次」 */
    setLast: function (file, uid, no) {
      LS.set(LASTKEY, JSON.stringify({ f: file, u: uid, n: no, t: Date.now() }));
    },
    getLast: function () {
      try { return JSON.parse(LS.get(LASTKEY) || 'null'); } catch (e) { return null; }
    },
    clearLast: function () { LS.set(LASTKEY, ''); },

    /* 一题一屏：窄屏默认开启，用户手动切换后记住偏好 */
    deckPref: function () {
      var v = LS.get(DECKKEY);
      return v === null ? null : v === '1';
    },
    setDeckPref: function (v) { LS.set(DECKKEY, v ? '1' : '0'); },
    isNarrow: function () {
      return !!(window.matchMedia && window.matchMedia('(max-width: 860px)').matches);
    },

    toast: function (msg) {
      var el = document.getElementById('toast');
      if (!el) return;
      el.textContent = msg;
      el.classList.add('on');
      clearTimeout(Shell._tt);
      Shell._tt = setTimeout(function () { el.classList.remove('on'); }, 1700);
    },

    /* 主题 */
    initTheme: function () {
      var btn = $('#themeBtn');
      if (LS.get(THEME) === 'dark') { document.documentElement.dataset.theme = 'dark'; }
      if (btn) {
        var dark = document.documentElement.dataset.theme === 'dark';
        btn.innerHTML = dark ? sunIcon() : moonIcon();
        btn.title = dark ? '切换到浅色' : '切换到深色';
        btn.addEventListener('click', function () {
          var next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
          document.documentElement.dataset.theme = next;
          LS.set(THEME, next);
          btn.innerHTML = next === 'dark' ? sunIcon() : moonIcon();
          btn.title = next === 'dark' ? '切换到浅色' : '切换到深色';
          Shell.toast(next === 'dark' ? '已切换到深色主题' : '已切换到浅色主题');
        });
      }
    },

    /* 滚动进度条 */
    initScroll: function () {
      var bar = document.getElementById('spBar');
      if (!bar) return;
      var ticking = false;
      function upd() {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        var p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
        bar.style.width = (p * 100).toFixed(2) + '%';
        ticking = false;
      }
      window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; window.requestAnimationFrame(upd); }
      }, { passive: true });
      window.addEventListener('resize', upd);
      upd();
    },

    /* 抽屉（窄屏目录） */
    initDrawer: function () {
      var t = $('#drawerToggle'), side = $('#sidebar');
      if (!t || !side) return;
      var scrim = document.createElement('div');
      scrim.className = 'scrim';
      document.body.appendChild(scrim);
      function close() { side.classList.remove('on'); scrim.classList.remove('on'); }
      t.addEventListener('click', function () {
        side.classList.toggle('on');
        scrim.classList.toggle('on');
      });
      scrim.addEventListener('click', close);
      Shell.closeDrawer = close;
      var cb = $('#sideClose');
      if (cb) cb.addEventListener('click', close);
      /* 抽屉里点目录项/分册自动收起（目录在所有宽度都走抽屉） */
      $$('#toc a, #plist a').forEach(function (a) {
        a.addEventListener('click', close);
      });
    },

    /* 键盘：/ 聚焦搜索，Esc 清空 */
    initKeys: function (input, onClear) {
      document.addEventListener('keydown', function (e) {
        if (!input) return;
        if (e.key === '/' && document.activeElement !== input) { e.preventDefault(); input.focus(); }
        if (e.key === 'Escape' && document.activeElement === input) {
          input.value = ''; input.blur();
          if (onClear) onClear();
        }
      });
    },

    /* 目录滚动高亮 */
    initSpy: function (secIds, tocSel) {
      if (!('IntersectionObserver' in window)) return;
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (!en.isIntersecting) return;
          $$(tocSel + ' a').forEach(function (a) {
            a.classList.toggle('active', a.dataset.target === en.target.id);
          });
        });
      }, { rootMargin: '-14% 0px -72% 0px' });
      secIds.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) io.observe(el);
      });
    },

    /* 可选网络字体：加载完再挂载，取不到自动回退系统字形 */
    loadWebFont: function () {
      window.addEventListener('load', function () {
        var l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap';
        document.head.appendChild(l);
      });
    },

    init: function () {
      Shell.initTheme();
      Shell.initScroll();
      Shell.initDrawer();
      Shell.loadWebFont();
    }
  };

  function moonIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>';
  }
  function sunIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"/></svg>';
  }

  g.Shell = Shell;
})(window);
