// 确保 footer 只渲染一次的观察脚本
(function() {
  // 监听 DOM 变化，防止动态渲染导致 footer 重复
  const observer = new MutationObserver(function(mutations) {
    const footers = document.querySelectorAll('footer');
    if (footers.length > 1) {
      // 只保留最后一个 footer，删除前面的
      for (let i = 0; i < footers.length - 1; i++) {
        footers[i].remove();
      }
    }
  });

  // 开始监听整个 body 的变化
  observer.observe(document.body, {
    childList: true,  // 监听子节点变化
    subtree: true     // 监听所有后代节点
  });

  // 初始检查（防止首次加载时就有多个 footer）
  const initialFooters = document.querySelectorAll('footer');
  if (initialFooters.length > 1) {
    for (let i = 0; i < initialFooters.length - 1; i++) {
      initialFooters[i].remove();
    }
  }
})();
