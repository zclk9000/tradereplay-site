# TradeReplay 官网目录索引

最后更新：2026-07-30

## 目录原则

正式发布边界只有 `public/`。网页的公开地址没有因本次整理而改变：
`public/support.html` 仍对应 `/support.html`，`public/guide.html` 仍对应
`/guide.html`。源内容、脚本、文档和本地资料不会被 Cloudflare 发布。

## 根目录索引

| 位置 | 用途 | 是否发布 |
|---|---|---|
| `public/` | 可直接部署的完整静态网站 | 是 |
| `content/` | Pages CMS 编辑的官网与教程源内容 | 否 |
| `scripts/` | 内容生成、数据检查和链接检查工具 | 否 |
| `docs/` | 设计规范、开发说明、帮助中心说明和本索引 | 否 |
| `_local/` | 原始截图、源视频和本地设计材料；Git 已忽略 | 否 |
| `.github/workflows/` | Pages CMS 正式发布流程 | 否 |
| `.pages.yml` | Pages CMS 字段、媒体库和发布按钮配置 | 否 |
| `wrangler.toml` | Cloudflare Workers 配置；发布目录固定为 `public/` | 否 |
| `.assetsignore` | Cloudflare 静态资源忽略规则 | 否 |
| `.gitignore` | 本地缓存与本地资料忽略规则 | 否 |

## 网页索引

网页集中放在 `public/` 根部，以保持历史网址不变。

| 文件 | 公开地址 | 内容 |
|---|---|---|
| `public/index.html` | `/` | 中英文官网首页 |
| `public/download.html` | `/download.html` | Windows 与 Mac 下载 |
| `public/changelog.html` | `/changelog.html` | 更新日志 |
| `public/guide.html` | `/guide.html` | 教程首页、分类、文章与搜索 |
| `public/support.html` | `/support.html` | 联系与售后支持 |
| `public/privacy.html` | `/privacy.html` | 隐私政策 |
| `public/terms.html` | `/terms.html` | 使用条款 |
| `public/refund.html` | `/refund.html` | 退款政策 |

## `public/` 内部索引

| 位置 | 内容 |
|---|---|
| `public/styles/` | 首页、教程、更新日志与法律页面样式 |
| `public/scripts/` | 页面交互、语言切换和生成后的官网内容 |
| `public/data/` | 生成后的教程合并数据 |
| `public/guide-assets/` | Pages CMS 上传的教程媒体；公开路径为 `/guide-assets/` |
| `public/assets/brand/` | Logo 与品牌图形 |
| `public/assets/product/` | 首页使用的产品界面与功能截图 |
| `public/assets/modes/` | 三种运行模式的压缩视频与封面 |
| `public/assets/showcase/` | 六项核心能力展示图 |
| `public/assets/support/` | QQ、企业微信图标与二维码 |
| `public/assets/commerce/` | 购买渠道图形 |
| `public/assets/cms/` | Pages CMS 上传的普通官网图片 |
| `public/assets/screenshots/product-gallery/` | 已整理的产品截图组 |
| `public/assets/guide/legacy-screens/` | 旧版教程截图，保留用于追溯 |
| `public/assets/legacy/` | 旧版官网图片，未确认无引用前不删除 |

## 内容和生成关系

| 源内容 | 生成结果 | 工具 |
|---|---|---|
| `content/site/*.json` | `public/scripts/site-content.generated.js` | `scripts/build-site-content.mjs` |
| `content/guide/catalog.json` 与 `content/guide/articles/*.json` | `public/data/guide-content.json` | `scripts/build-guide-content.mjs` |

生成文件不要直接手工修改。先修改 `content/` 中的源内容，再运行生成工具。

## 本地资料索引

`_local/design-materials/archive-2026-07-30/` 保存本次整理前的本地资料：

- `design-captures/`：官网设计检查截图；
- `product-screens/`：产品界面原图；
- `source-videos/`：未作为正式资源发布的源视频。

这些材料仍属于官网项目，没有放到其他项目中。

## 维护规则

1. 新网页放入 `public/`，并在本索引的网页表中登记。
2. 新样式和浏览器脚本分别放入 `public/styles/`、`public/scripts/`。
3. 新图片先判断用途，再进入 `public/assets/` 对应分类；原始大文件留在 `_local/`。
4. 教程上传媒体只放 `public/guide-assets/`，不要改变其公开 URL。
5. 发布前依次运行 README 中的五项生成与校验命令。
6. 不从其他任务单独提交或部署；正式发布统一走 Pages CMS 工作流。
