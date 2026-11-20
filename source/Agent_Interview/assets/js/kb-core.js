/* KB 数据注册中心：数据文件通过 KB.register() 注入，app.js 负责渲染 */
(function (global) {
  var cats = [];

  global.KB = {
    cats: cats,
    register: function (cfg) {
      if (!cfg || !cfg.id || !cfg.items) return;
      cats.push({
        id: cfg.id,
        idx: cfg.idx,
        title: cfg.title,
        desc: cfg.desc || '',
        items: cfg.items
      });
    },
    total: function () {
      return cats.reduce(function (n, c) { return n + c.items.length; }, 0);
    },
    countByTag: function () {
      var m = { base: 0, adv: 0, deep: 0, hot: 0 };
      cats.forEach(function (c) {
        c.items.forEach(function (i) { if (m[i.tag] != null) m[i.tag]++; });
      });
      return m;
    }
  };
})(window);
