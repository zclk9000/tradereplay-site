# TradeReplay 帮助中心

帮助中心是官网中的中英双语模块。中文和英文使用同一文章 ID、教程编号、分类、发布状态、
相关文章和媒体文件，文字分别维护。任何语言的入口都继续使用 `public/guide.html`。

## 权威文件

- `.pages.yml` — Pages CMS 的中文文章、英文文章、媒体库和统一发布按钮。
- `content/guide/catalog.json` — 版本、中文分类和文章文件目录。
- `content/guide/articles/*.json` — 中文正文及共享结构、状态、关系和媒体文件。
- `content/guide/locales/en/catalog.json` — 英文分类文字。
- `content/guide/locales/en/articles/*.json` — 英文正文、搜索词和媒体说明。
- `public/data/guide-content.json` — 自动生成的双语公开数据，不得手工修改。
- `public/guide-assets/` — 两种语言共用的正式截图和视频。
- `public/guide.html`、`public/styles/guide.css`、`public/scripts/guide.js` — 页面、
  样式、语言切换、搜索和内容呈现。

## 路由与语言

帮助中心使用查询参数导航，`lang` 由链接显式传递：

```text
guide.html?lang=zh
guide.html?lang=en
guide.html?category=quick-start&lang=en
guide.html?article=qs-04&lang=en
```

没有 `lang` 时依次使用已保存的语言和浏览器语言。切换语言时保留当前分类或文章，并把
选择保存到 `tradereplay-language`。每篇文章的稳定小写 `id` 和大写 `code` 不得在
发布后修改或复用。

## 使用 Pages CMS 编辑

打开 [Pages CMS](https://app.pagescms.org)，进入 `zclk9000/tradereplay-site`：

1. 中文进入“教程中心 → 中文教程文章”。
2. 英文进入“教程中心 → English tutorial articles”。
3. 分类名称分别在“中文分类与版本设置”和“English category text”维护。
4. 图片与视频只在中文文章的“章节截图或视频”选择；英文文章维护对应 caption 和
   accessible description。
5. 保存会提交内容，但不会自动部署。
6. 完成检查后，再使用“发布当前官网（含教程）”统一发布整个 `public/`。

中文文章与英文文章必须一一对应。校验器会检查 11 个分类、41 篇已发布文章、章节 ID
和顺序、步骤数、要点数、提示框、常见问题数及媒体说明。中文新增或调整结构时，英文
必须在同一次提交中同步，否则生成和正式发布都会失败。

## 内容与素材规则

- `status: "ready"` 的中文文章才会进入中英双语公开数据。
- `status: "planned"` 不公开，英文不应独立改变发布状态。
- 相关文章、分类、重点推荐和素材路径由中文源文件统一管理。
- 图片和视频只上传到 `public/guide-assets/`；两种语言共用同一文件。
- 素材未完成时保持 `ready: false`，正式网站不会显示占位素材。
- 英文使用简明的国际英语、主动语态和 sentence case，不逐字翻译中文语序。
- 不上传真实姓名、邮箱、账号、激活码、API key、Access Key、验证码、电脑用户名、
  完整本地路径或私有云存储地址。

Pages CMS 为保护既有链接，不允许直接新建、删除或改名教程文章。新增选题时先建立
中文源文件、英文对应文件和目录项，再开放编辑。

## 生成与发布

修改教程源内容后运行：

```bash
node scripts/validate-guide-content.mjs
node scripts/build-guide-content.mjs
node scripts/validate-public-site.mjs
```

生成器会保留顶层中文数据，并在 `locales.en` 写入英文分类和文章。只有已经标记
`ready: true` 的共享素材才进入公开数据，内部拍摄说明不会发布。

正常生产发布只使用 Pages CMS 的“发布当前官网（含教程）”。它会重新验证并生成内容，
确认 Git 中没有生成文件漂移后，部署整个 `public/`。保存、Git push 和生产部署是三个
不同动作；未经用户明确授权不得部署。

## 本地预览

教程必须通过 HTTP 预览：

```bash
python3 -m http.server 8801 --bind 127.0.0.1 --directory public
```

至少检查：

- 中文和英文的首页、分类、文章、相关文章和未找到页面；
- 中文词只搜索中文内容，英文词只搜索英文内容；
- 语言切换保留当前文章或分类，刷新后仍保留选择；
- 1440、1024、768、390 像素宽度和手机横屏；
- 深色、浅色及减少动态效果模式；
- 键盘焦点、移动菜单、`/` 搜索快捷键和无障碍名称；
- 页面没有横向溢出，浏览器控制台没有错误。
