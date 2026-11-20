(() => {
  document.cookie = 'f1111lagggg=f1111lagggg{Y0u_f0und_th3_th1rd_f1a9}; Path=/; SameSite=Lax' +
    (location.protocol === 'https:' ? '; Secure' : '');

  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    const posts = document.querySelector('#recent-posts');
    const index = document.getElementById('folajj-index');
    if (posts && index) posts.prepend(index.content.cloneNode(true));
  }

  const originalControl = 'input, textarea, select, [contenteditable]';
  document.addEventListener('keydown', event => {
    if (event.ctrlKey && !event.shiftKey && !event.altKey && event.key.toLowerCase() === 'p' && !event.target.closest?.(originalControl)) {
      event.preventDefault();
    }
  });

  const still = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sayings = [
    '今天看论文没？', '黑客别黑我！', '欢迎CTFer！', '恭喜恭喜！', '你的女朋友呢？',
    '代码敲完了吗？', '你可以的！', '我想要入股纳斯达克！', '我想要毕业！', '集美们，别偷看！',
    '你是什么成分？', '我的法学硕士！', '变压器呢？', '能给我赞助1元吗？',
    '毕业了我一定要去摆摊炒粉！', '家人们谁懂啊？', '哈吉米哦南北绿豆！',
    '同学，你上课不认真啊！', '你这个需求不太好搞啊', '感觉不如原神！', '原神,启动！',
    '其实，我知道你在看我！', '读研哪有不发疯的！', '嘎啦给木里面不是这样的！',
    '难道他真是赋能哥？', '颗秒！！', '+3', '空军老哥', '参考文献在哪？', '震撼首发！',
    '我希望你永远不要知道Vc的用处！', '卧槽，他真的是黑客吗？', '我一定要考上深砖！',
    '学网安，这辈子有了', '芝士雪豹', '我的钱还有用！', '有人喜欢钓蟹吗？', 'emo', '曼波，曼波！', '哦马吉利曼波','BLG牛逼！',
    'Agent,启动！','GTA6,启动！','十年老粉，不请自来！','你知道，我一直都喜欢你的！','我喜欢你！','终于还是到这一天了吗？',
    '人只有对现状不满，才会怀念过去！'
  ];
  const greetings = [
    [6, '月亮不睡我不睡，我是你的小宝贝！'], [11, '我超，起这么早？'],
    [13, '中午吃什么？'], [16, '下午泡壶茶摸摸鱼就过去了'], [24, '晚上打把LoLm']
  ];
  let pool = [];
  function nextSaying() {
    if (Math.random() < 0.05) {
      const hour = new Date().getHours();
      return greetings.find(([end]) => hour < end)[1];
    }
    if (!pool.length) pool = sayings.slice();
    return pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
  }
  document.addEventListener('click', event => {
    if (event.detail === 0 || still.matches ||
        event.target.closest('a, button, label, summary, pre, .site-jump, ' + originalControl) ||
        window.getSelection()?.toString()) return;
    const text = document.createElement('span');
    text.className = 'site-click-text';
    text.setAttribute('aria-hidden', 'true');
    text.textContent = nextSaying();
    text.style.top = Math.max(45, event.clientY - 12) + 'px';
    document.body.append(text);
    const margin = text.offsetWidth / 2 + 6;
    text.style.left = Math.max(margin, Math.min(event.clientX, window.innerWidth - margin)) + 'px';
    text.addEventListener('animationend', () => text.remove(), { once: true });
  });
})();
