/* global hexo */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { parse, parseFragment } = require('parse5');

const tools = new Set([
  '/MyNavPage/', '/MyNavPage/index.html',
  '/SRK_Toolbox/SRK_Toolbox.html',
  '/Agent_Interview/', '/Agent_Interview/index.html'
]);

hexo.extend.filter.register('markdown-it:renderer', (parser) => {
  if (parser.__folajjMath) return;
  parser.__folajjMath = true;
  parser.use(require('@mdit/plugin-cjk-friendly').cjkFriendly);
  const texmath = require('markdown-it-texmath');
  parser.use(texmath, { engine: require('katex'), delimiters: 'dollars', katexOptions: { strict: 'ignore' } });
  parser.core.ruler.before('block', 'folajj-math', state => {
    state.env.folajjMath = /^\$\$\s*$/m.test(state.src);
  });
  for (const type of ['inline', 'block']) {
    for (const rule of texmath.rules.dollars[type]) {
      const match = texmath[type](rule);
      parser[type].ruler.at(rule.name, (state, ...args) => state.env.folajjMath && match(state, ...args));
    }
  }
});

function firstBodyImage(node, base, origin) {
  if (['pre', 'code', 'template'].includes(node.tagName)) return;
  if (node.tagName === 'img') {
    const attr = name => node.attrs.find(item => item.name === name)?.value;
    const src = (attr('data-lazy-src') || attr('data-src') || attr('src'))?.trim();
    if (!src || src.startsWith('#')) return;
    try {
      const url = new URL(src, base);
      if (!['https:', 'http:'].includes(url.protocol)) return;
      return url.origin === origin ? url.pathname + url.search + url.hash : url.href;
    } catch {
      return;
    }
  }
  for (const child of node.childNodes || []) {
    const src = firstBodyImage(child, base, origin);
    if (src) return src;
  }
}

hexo.extend.filter.register('after_post_render', post => {
  if (!post.source?.startsWith('_posts/') || post.cover === false || post.cover || !post.content?.includes('<img')) return post;
  const site = new URL(hexo.config.url);
  const image = firstBodyImage(parseFragment(post.content), new URL(post.path, site), site.origin);
  if (image) {
    post.cover = image;
    post.cover_type = 'img';
  }
  return post;
}, 20);

hexo.extend.generator.register('math-assets', function () {
  const root = path.dirname(require.resolve('katex/dist/katex.min.css'));
  const texmath = require.resolve('markdown-it-texmath/css/texmath.css');
  const files = [
    [texmath, 'site/math/texmath.css'],
    [path.join(root, 'katex.min.css'), 'site/math/katex.min.css'],
    ...fs.readdirSync(path.join(root, 'fonts')).map(file => [
      path.join(root, 'fonts', file), 'site/math/fonts/' + file
    ])
  ];
  return files.map(([file, route]) => ({ path: route, data: () => fs.createReadStream(file) }));
});

hexo.extend.generator.register('legacy-routes', function (locals) {
  return { path: 'site/legacy-routes.json', data: JSON.stringify(locals.data.legacy_routes) };
});

hexo.extend.filter.register('after_render:html', html => {
  if (!html.includes('id="body-wrap"')) return html;
  const edits = [];
  function visit(node) {
    const attr = name => node.attrs?.find(item => item.name === name)?.value;
    if (node.tagName === 'a' && tools.has(attr('href'))) {
      const link = node.sourceCodeLocation?.startTag;
      if (link && !attr('target')) edits.push([link.endOffset - 1, ' target="_blank" rel="noopener"']);
    }
    if (attr('id') === 'recent-posts') {
      const close = node.sourceCodeLocation?.endTag;
      if (close) edits.push([close.startOffset, '<!-- 恭喜你找到了一个flaaaaaaaag: flaaaaaaaag{7h1s_1s_th3_fir3t_f1a9} -->']);
    }
    if (attr('class') === 'error_subtitle') {
      const close = node.sourceCodeLocation?.endTag;
      if (close) edits.push([close.endOffset, '<details class="site-404-note"><summary>这页还有一句话</summary><code>ffffffffflaaaaag{7h1s_1s_exact1y_th3_70urth_f1a9}</code></details>']);
    }
    for (const child of node.childNodes || []) visit(child);
    if (node.content) visit(node.content);
  }
  visit(parse(html, { sourceCodeLocationInfo: true }));
  for (const [offset, text] of edits.sort((a, b) => b[0] - a[0])) {
    html = html.slice(0, offset) + text + html.slice(offset);
  }
  return html;
}, 20);
