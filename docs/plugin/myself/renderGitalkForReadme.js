// 将 Gitalk 渲染逻辑挂到全局，供 docsify 插件调用
window.renderGitalkForReadme = function(vm) {
  var container = document.getElementById('gitalk-container');
  var contentEl = document.querySelector('.content');

  // 如果找不到 Gitalk 容器或内容区域，直接退出
  if (!container || !contentEl) return;

  // 确保 Gitalk 容器挂在 docsify 的内容区域内部，参与正常文档流
  if (container.parentNode !== contentEl) {
    contentEl.appendChild(container);
  }

  var path = vm && vm.route && vm.route.path ? vm.route.path : '/';
  var isReadme = path === '/README' || path === '/README.md';

  if (!isReadme) {
    container.innerHTML = '';
    container.style.display = 'none';
    return;
  }

  // 只在 README 页面显示评论容器
  container.style.display = 'block';

  var title = location.hash.match(/#(.*?)([?]|$)/);
  if (title != null) {
    title = location.hash.match(/#(.*?)([?]|$)/)[1];
  }

  // 保持你原来的标题和 id 处理逻辑
  if (title != null) {
    title = decodeURI(title.substring(1, title.length));
    if (title.length >= 50) {
      title = title.substring(title.length - 50, title.length);
    }
  } else {
    title = 'home page';
  }

  // 每次切换到 README 都重新渲染一次，避免复用旧的 issues
  container.innerHTML = '';

  var gitalk = new Gitalk({
    clientID: 'Ov23li29QbSJE1lhrlNm',
    clientSecret: '03cb076b091d695858e819d98409b9313d4f3560',
    repo: 'FoLaJJ.github.io',
    owner: 'FoLaJJ',
    admin: ['FoLaJJ'],
    distractionFreeMode: true,
    title: title,
    id: title
  });
  gitalk.render('gitalk-container');
};
