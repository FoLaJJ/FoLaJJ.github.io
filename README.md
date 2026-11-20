# FoLaJJ 的笔记簿

个人博客使用 Hexo + Butterfly，部署到 [folajj.github.io](https://folajj.github.io/)。本地目录为 `D:\hexo`，源码只维护 `main` 分支。

日常流程：**更新本地 → 写 Markdown → 本地预览 → 构建检查 → Git 提交推送 → GitHub Actions 自动发布**。

## 1. 第一次使用和换电脑

安装 Git 和 Node.js 24。以下命令以 Windows PowerShell 为例，使用 `npm.cmd` 可以避开 `npm.ps1` 的执行策略问题。

已有本地项目时：

~~~powershell
cd D:\hexo
git status -sb
git pull --ff-only origin main
npm.cmd ci
npm.cmd run dev
~~~

第一次克隆到新电脑：

~~~powershell
cd D:\
git clone git@github.com:FoLaJJ/FoLaJJ.github.io.git hexo
cd D:\hexo
npm.cmd ci
npm.cmd run dev
~~~

SSH 克隆需要该电脑已配置 GitHub SSH 密钥。也可以在 GitHub 仓库的 **Code → HTTPS** 复制地址克隆。

预览地址为 `http://localhost:4000/`；按 `Ctrl+C` 停止。文章保存后会自动重新生成，刷新浏览器查看。修改主题配置、全站配置或 `scripts/` 后，停止并重开预览。

`npm.cmd ci` 用于首次安装和依赖变更后；平时写文章不需要反复执行。开始编辑前先同步远端；如果 `git pull --ff-only` 报错，先用 `git status` 查看本地未提交改动或分支分歧。

## 2. 新文章写在哪里

### 直接新建正式文章

~~~powershell
cd D:\hexo
npm.cmd run new -- "我的新文章"
~~~

命令生成 `source/_posts/我的新文章.md`。用 Typora、VS Code 或其他 Markdown 编辑器打开它写作，也可以直接在 `source/_posts/` 下手动新建 Markdown 文件。

文章可以分文件夹存放，例如 `source/_posts/工作/我的新文章.md`。**文件夹便于本地整理；网站分类由文章头部的 `categories` 决定。**

### 一篇完整的最小示例

~~~markdown
---
title: Git 使用笔记
date: 2026-11-20 12:00:00
permalink: posts/git-notes/
categories:
  - 编程与工程
  - 工程笔记
tags:
  - Git
  - 开发工具
description: 记录暂存区、提交和推送的常用方法。
---

用一段话说明这篇文章解决什么问题。

## 暂存区

这里写正文，**重点可以加粗**。

![终端截图](/images/git-notes/terminal.webp)

更多背景见[Git 官方文档](https://git-scm.com/docs)。
~~~

头部两行 `---` 之间是 YAML 配置，缩进使用空格。建议给新文章设置简短、固定的 `permalink`；以后改标题或移动文件时保留它，原网址就能继续使用。同一个永久链接只能对应一篇文章。

| 字段 | 用途 |
| --- | --- |
| `title` | 网页显示的文章标题 |
| `date` | 发布时间；首页按此时间倒序排列，修改正文不会自动置顶 |
| `updated` | 可选，手动记录更新日期；当前文章页默认显示创建日期 |
| `permalink` | 文章固定路径，例如 `posts/git-notes/` |
| `categories` | 层级分类；上例是“编程与工程 → 工程笔记” |
| `tags` | 并列标签，分类和标签页构建时自动更新 |
| `description` | 文章描述，用于搜索引擎等页面信息 |
| `cover` | 可选，指定文章卡片封面；规则见下一节 |
| `top_img` | 可选，单独指定文章顶部大图 |

### 先写草稿，再发布

~~~powershell
npm.cmd run draft -- "待完成的笔记"
npm.cmd run dev:drafts
~~~

草稿在 `source/_drafts/待完成的笔记.md`。`dev:drafts` 会在本地显示草稿，普通预览与线上构建默认不显示。

完成后停止草稿预览，再执行：

~~~powershell
npm.cmd run publish -- "待完成的笔记"
npm.cmd run dev
~~~

发布命令会把草稿移到 `source/_posts/`。这里的“发布”只改变本地文件位置，仍需 Git 提交和推送才会更新线上。

草稿即使不生成网页，提交到这个公开仓库后仍能通过 GitHub 查看。新文章和草稿的默认头部模板分别在 `scaffolds/post.md`、`scaffolds/draft.md`。

## 3. 图片、附件和封面

### 放图片

新图片建议按文章分目录放到 `source/images/`：

~~~text
source/
  _posts/工作/Git使用笔记.md
  images/git-notes/terminal.webp
  images/git-notes/original.jpg
  pdf/git-notes.pdf
~~~

Markdown 使用站点根路径，**省略 `source`**：

~~~markdown
![终端截图](/images/git-notes/terminal.webp)

[下载 PDF](/pdf/git-notes.pdf)

[![照片预览](/images/git-notes/terminal.webp)](/images/git-notes/original.jpg)
~~~

不要写 `D:/…`、`file:///…` 等电脑路径，线上访问不到。图片文件名、大小写和扩展名要与磁盘一致。可先压缩大照片或生成 WebP，再提交；现有游记使用预览图，点击可打开原图。

原有 `source/_media/`、`source/_media2/`、`source/pdf/` 中的文件仍被文章引用，维护现有文章时可继续使用。

### 文章封面规则

1. 文章头部指定了 `cover`：使用指定封面。
2. 未指定时：自动使用正文第一张图片。
3. 正文也没有图：使用约 2 KB 的原创插画 `/site/notes-cover.svg`。
4. 设置 `cover: false`：关闭这篇文章的卡片封面。

手动指定的例子：

~~~yaml
cover: /images/git-notes/terminal.webp
top_img: /site/background.webp
~~~

`cover` 影响文章列表等卡片；`top_img` 影响点进文章后的页头大图。全站照片背景在 `source/site/background.webp`，与默认小封面分开设置。

正文图片使用 `max-width: 100%; height: auto` 等比缩放。要改图片显示规则，到 `source/site/blog.css` 中查找 `#article-container img`，不要把宽和高写成不成比例的固定值。

## 4. 本地预览、检查和正式发布

编辑和预览：

~~~powershell
cd D:\hexo
npm.cmd run dev
~~~

确认正文、图片、目录和链接后，用 `Ctrl+C` 停止预览，再在同一终端执行：

~~~powershell
npm.cmd run build
npm.cmd run check
git status -sb
git diff
git add -A
git diff --cached --stat
git commit -m "更新文章和站点内容"
git push origin main
~~~

`build` 会先清理生成目录，再构建 `public/`。`check` 检查本地图片、下载文件、站内链接和基础页面；出现错误时先修复，不要跳过。它不负责验证所有外部网站是否在线。

`git add -A` 会暂存新增、修改和删除；提交前确认列表只含要发布的文件。如果 Git 提示没有可提交内容，就不需要再次提交。

推送后打开仓库 **Actions → Deploy Hexo to Pages**，查看对应提交的 `build` 和 `deploy`。都成功后打开线上站点；如果浏览器仍显示旧版，使用 `Ctrl+F5` 强制刷新。

### GitHub Pages 的关键设置

仓库 **Settings → Pages → Build and deployment → Source** 必须选择 **GitHub Actions**。这是首次设置，正常更新文章不用每次重选。

不要切回 **Deploy from a branch** 去发布 `main` 根目录或 `/docs`。`main` 保存的是 Hexo 源码，工作流负责安装依赖、编译并部署 `public/`。如果日志出现 `github-pages` 或“`The butterfly theme could not be found`”，通常是运行了默认 Jekyll 构建，应先检查这个 Source 设置。

自动部署定义在 `.github/workflows/pages.yml`，推送 `main` 会触发。也可在 **Actions → Deploy Hexo to Pages → Run workflow** 手动选择 `main` 重新部署。如果 `github-pages` 环境限制部署分支，允许 `main`。

## 5. 想改哪里，就编辑哪个文件

| 要改的内容 | 文件与配置位置 |
| --- | --- |
| 新文章、现有正文 | `source/_posts/` 中对应的 Markdown |
| 草稿 | `source/_drafts/` |
| 新成员任务 | `source/guide/onboarding/index.md` |
| 课程与主题索引 | `source/guide/courses/`、`security/`、`misc/`、`travel/` |
| 关于页 | `source/about/index.md` |
| 网站名称、作者、语言、网址 | `_config.yml` 中的 `title`、`author`、`language`、`url` |
| 首页每页文章数 | `_config.yml` 的 `index_generator.per_page` |
| 顶栏菜单文字、链接、顺序 | `_config.butterfly.yml` 的 `menu` |
| 右侧四个快捷入口 | `_config.butterfly.yml` 的 `inject.bottom` 中 `site-jump` |
| 首页四个主题入口 | 同一配置的 `folajj-index` 模板 |
| 右侧“学习指南”卡片 | `source/_data/widget.yml` |
| 侧栏头像、介绍、GitHub 按钮 | `_config.butterfly.yml` 的 `avatar`、`aside.card_author` |
| GitHub、哔哩哔哩社交链接 | 同一配置的 `social` |
| 全站背景及页头照片 | 同一配置的 `background`、`index_img`、`default_top_img` |
| 首页页头高度 | 同一配置的 `index_top_img_height` |
| 默认小封面、图片加载失败时的占位图 | 同一配置的 `cover.default_cover`、`error_img.post_page` |
| 小封面插画本身 | `source/site/notes-cover.svg` |
| 导航字号、页面宽度、颜色、间距 | `source/site/blog.css` |
| 首页站名下方的一行文字 | 同一 CSS 中 `#site-title::after` 的 `content` |
| 页脚文字 | `_config.butterfly.yml` 的 `footer.custom_text` |
| 卜算子统计 | 同一配置的 `busuanzi`，页脚计数元素在 `footer.custom_text` |
| 点击浮字、分时问候、快捷键 | `source/site/interactions.js` |
| 控制台输出 | `source/site/console-output.js` |
| 404 页面 | 主题配置的 `error_404` |
| 文章封面自动提取、工具新标签页规则 | `scripts/site.js` |
| 新建文章的默认格式 | `scaffolds/post.md`、`scaffolds/draft.md` |
| 命令与依赖版本 | `package.json`、`package-lock.json` |
| 构建检查 | `tools/check-site.mjs` |
| 自动部署 | `.github/workflows/pages.yml` |

三个独立工具的文件分别在 `source/MyNavPage/`、`source/SRK_Toolbox/`、`source/Agent_Interview/`。替换它们时保留各自的入口文件与相对资源结构；当前工具入口均在新标签页打开。

### 字号和页面宽度

`source/site/blog.css` 开头集中维护这些变量：

~~~css
--nav-text-size: 18px;       /* 菜单文字 */
--nav-icon-size: 19px;       /* 菜单图标 */
--nav-brand-size: 23px;      /* 左侧站名 */
--page-max-width: 1200px;    /* 主体最大宽度，包含侧栏 */
--article-width: 74%;       /* 桌面正文占比 */
~~~

正文想宽些，可把后两项改为 `1400px` 和 `78%`。手机端会占满可用宽度，不按这个桌面比例分栏。正文自身的字号、行高在同文件的 `#article-container` 中调整。

主题通过 npm 安装，**自定义内容改站点配置和 `source/`，不要直接修改 `node_modules/hexo-theme-butterfly/`**，否则重新安装依赖会覆盖。

## 6. 目录用途与清理

| 目录或文件 | 用途 | Git 提交 |
| --- | --- | --- |
| `source/` | 文章、页面、图片、附件、独立工具和自定义样式 | 提交 |
| `scaffolds/` | 新文章、草稿模板 | 提交 |
| `scripts/`、`tools/` | 站点扩展和构建检查 | 提交 |
| `_config*.yml`、`package*.json` | 站点配置与依赖锁定 | 提交 |
| `.github/workflows/` | 自动部署流程 | 提交 |
| `source/.nojekyll` | 静态站点标记，构建时复制到输出目录 | 提交 |
| `public/` | 构建后的网页和原样复制的静态资源 | 不提交，可重建 |
| `node_modules/` | 安装的 Hexo、主题和插件 | 不提交，可用 `npm.cmd ci` 重装 |
| `db.json` | Hexo 缓存 | 不提交，可重建 |

`source/` 与 `public/` 中出现相同图片是正常的：前者是源文件，后者是供浏览器访问的构建产物。不要修改 `public/` 来改站点，下次构建会覆盖。

清理生成网页和缓存：

~~~powershell
npm.cmd run clean
npm.cmd run build
npm.cmd run check
~~~

历史文章的图片、PDF、工具文件以及现有彩蛋仍在使用，不能按“看起来旧”直接删除。兼容以前收藏的网址由 `source/site/legacy.js` 与 `source/_data/legacy_routes.json` 负责；修改已迁移文章的永久链接时，同步修改映射。旧框架运行文件、一次性迁移脚本及迁移截图不属于日常维护内容。

## 7. 常见问题

| 问题 | 处理 |
| --- | --- |
| PowerShell 提示不能运行 `npm.ps1` | 使用本说明中的 `npm.cmd` |
| 4000 端口被占用 | 先停止已有预览；临时改端口可用 `npm.cmd run dev -- --port 4001` |
| 改配置后没变化 | 停止并重开预览；线上确认改动已提交、推送且部署成功 |
| 文章有文件却没出现在首页 | 检查是否还在 `_drafts/`、是否已发布、头部日期与 YAML 格式 |
| 图片不显示 | 检查是否位于 `source/`、正文网址是否省略 `source`，再核对大小写、文件名和 `npm.cmd run check` |
| 图片变形 | 保留 `height: auto`，检查该图片是否有冲突的固定宽高或内联样式 |
| 首页文章顺序没变化 | 按 `date` 排序；只改正文不改变排序 |
| 部署报 Butterfly 找不到 | Pages Source 选 `GitHub Actions`，查看 `Deploy Hexo to Pages` 工作流 |
| 是否需要自己添加 `.nojekyll` | `source/.nojekyll` 已存在；此文件不负责把源码编译成网页，仍需使用 Hexo 工作流 |
| 线上 404 | 确认 Source 设置与最新部署状态，再检查文章永久链接；不要直接从源码分支发布 |
| 本地访问统计很大 | 本地统计不能当成线上统计；计数由第三方服务返回 |

进一步参考：[Hexo 写作](https://hexo.io/docs/writing)、[文章头部配置](https://hexo.io/docs/front-matter)、[GitHub Pages 发布来源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。
