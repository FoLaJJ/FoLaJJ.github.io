# FoLaJJ 的笔记簿

个人博客，使用 Hexo 和 [Butterfly](https://github.com/jerryc127/hexo-theme-butterfly)。线上地址为 [folajj.github.io](https://folajj.github.io/)。

## 本地使用

推荐 Node.js 24，项目所用依赖已锁定。Windows PowerShell 如果禁止 `npm.ps1`，可将下列命令里的 `npm` 换成 `npm.cmd`。

本地项目目录为 `D:\hexo`，先在终端进入该目录。源码统一使用 `main` 分支。

~~~sh
npm ci             # 首次使用或依赖变更后
npm run dev        # http://localhost:4000/
npm run build      # 生成静态站点 public/
npm run check      # 构建后检查文章、旧路由、站内引用与静态文件
~~~

新建文章用 `npm run new -- "文章标题"`，或直接在 `source/_posts/` 下写 Markdown。修改文件后，本地服务器会自动重建受影响的页面；刷新浏览器即可查看。

| 内容 | 位置 |
| --- | --- |
| 文章、分类与标签 | `source/_posts/`，在各文章头部维护 `categories`、`tags` |
| 专题索引、新成员指南 | `source/guide/` |
| 图片与附件 | `source/_media/`、`source/_media2/`、`source/pdf/`，用站点根路径引用 |
| 三个独立工具 | `source/MyNavPage/`、`source/SRK_Toolbox/`、`source/Agent_Interview/` |
| 主题设置与样式 | `_config.butterfly.yml`、`source/site/blog.css` |
| 旧站交互与快捷入口 | `source/site/interactions.js`、`_config.butterfly.yml` 的 `inject.bottom` |
| 新成员任务与学习资料入口 | `source/_data/widget.yml`，手机菜单在主题配置的 `menu` 中维护 |
| Docsify 旧链接 | `source/_data/legacy_routes.json`，迁移文章改永久链接时也要更新此表 |

游记正文使用 WebP 预览，点图可打开原文件。正文使用独立一行的 `$$` 包裹块级公式时，也会启用 `$...$` 行内公式。正文链接用 Markdown 的 `[文字](网址)`，搜索索引由 `hexo-generator-search` 构建。

在文章头部填写 `cover: /图片路径` 可手动指定封面，`cover: false` 可关闭。未填写时使用正文第一张图，没有图时使用原创线条插画 `source/site/notes-cover.svg`。

顶栏字号在 `source/site/blog.css` 开头的 `--nav-text-size`、`--nav-icon-size`、`--nav-brand-size` 调整；菜单在 `_config.butterfly.yml` 的 `menu` 中调整。右侧快捷工具及其顺序在同一文件的 `inject.bottom` 中维护。

同一 CSS 文件开头的 `--page-max-width` 控制主体区域的最大宽度（默认 `1200px`），`--article-width` 控制桌面文章栏占比（默认 `74%`，侧栏自动使用剩余部分）。例如改成 `1400px` 和 `78%` 可加宽正文。手机端仍占满可用宽度，正文图片按原始比例缩放。

页脚和文章页沿用原站的卜算子服务；实际计数由服务端按访问站点统计。本地预览的数字不代表线上站点。

`source/` 是需要编辑和提交的源目录；`public/` 是 Hexo 从源目录和主题生成的静态站点，图片、PDF 和独立工具会原样复制过去。可以清理 `public/`，下次构建会重新生成。

## 发布到 GitHub Pages

1. 首次发布前，在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。如果仓库的 `github-pages` 环境限制了部署分支，需允许 `main`。
2. 在 `main` 提交文章和配置，然后执行 `git push origin main`。
3. 在 **Actions → Deploy Hexo to Pages** 查看运行结果。工作流安装锁定依赖、构建并检查站点，全部通过才部署 `public/`。之后每次推送 `main` 都会自动发布。无需提交 `public/`、`node_modules/` 或生成缓存。

旧 Docsify 源文件仍可在迁移前的 Git 提交 `c4e12ab` 查看。迁移时保留了原始图片、附件和独立工具的路径，并为原有 `/#/文章路径` 增加跳转。
