# TradeReplay 帮助中心

帮助中心是官网中的独立模块。官网首页已经从页头、教程区域、底部行动按钮和页脚接入
`guide.html`，因此维护教程时不需要修改首页文件。

## Files

- `.pages.yml` — Pages CMS 中文编辑表单、媒体库和发布按钮配置。
- `content/guide/catalog.json` — 教程版本、分类和文章数据文件目录。
- `content/guide/articles/*.json` — 每篇教程一个独立内容文件。
- `guide-content.json` — 发布时自动生成、供浏览器快速读取的合并内容。
- `guide-assets/` — Pages CMS 上传的教程图片与视频。
- `guide-loader.js` — 在浏览器中读取分类和文章内容。
- `guide.html` — 帮助中心的页头、页脚和搜索框。
- `guide.css` — 帮助中心版面、文章排版和响应式样式。
- `guide.js` — 首页、分类、文章、搜索和目录的显示逻辑。

## Routes

The static site uses query-string routes:

```text
guide.html
guide.html?category=quick-start
guide.html?article=qs-04
```

每篇文章必须使用稳定的小写 `id` 和大写教程编号 `code`。文章发布后不要修改或重复使用
`id`，否则旧链接会失效。

## 使用 Pages CMS 编辑

打开 [Pages CMS](https://app.pagescms.org)，进入 `zclk9000/tradereplay-site`：

1. 左侧进入“教程中心 → 教程文章”。
2. 使用标题、教程编号或关键词搜索文章。
3. 修改标题、摘要、正文、步骤、提示框或常见问题。
4. 在“章节截图或视频”里上传素材，并打开“在网站显示真实素材”。
5. 点击保存。Pages CMS 会把修改提交到 GitHub。
6. 检查无误后，点击左侧“发布教程到官网”。

“保存”和“发布”是两个动作。保存后可以继续修改；只有点击发布按钮，正式网站才会更新。

首次使用发布按钮前，需要在 GitHub 仓库设置两个 Actions secret：

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

密钥只存放在 GitHub Secrets，不能写进教程内容、配置文件或截图。

## 文章状态

`status: "ready"` 表示文章正文已经完成，可以从分类和搜索结果打开。

`status: "planned"` 只显示文章标题和计划状态，不会把未完成正文当作已发布教程。

当前内容包括：

- 11 个完整分类；
- 41 篇首批高优先级文章；
- 8 篇已经写完的详细教程；
- 分类层级展示的完整规划共 149 篇。

详细选题和制作顺序仍记录在：

`/Users/charlie/ClaudeCode/TradeReplay/tradereplay/docs/help-center-content-plan.md`

## 图片和视频

推荐从文章中的“章节截图或视频”上传，便于保持所有教程版面一致：

- 素材类型选择“图片 / 截图”或“视频”；
- “素材标题”会显示在素材下方；
- “上传或选择素材”会把文件保存到 `guide-assets/`；
- 视频可以另外上传封面；
- 上传后打开“在网站显示真实素材”；
- 如果还没拍摄，保持开关关闭并填写“拍摄或补充说明”，网站会显示设计好的占位框。

正文富文本编辑器也支持直接插入图片。需要固定标题、视频封面或占位说明时，优先使用
“章节截图或视频”。

不要上传或拍到以下信息：

- 真实姓名、邮箱和手机号；
- 激活码、API key、Access Key；
- 交易账号、券商登录信息；
- 电脑用户名和完整本地路径；
- 云存储地址和任何可以复用的凭据。

## 新增文章

为了保护现有链接，Pages CMS 暂时只允许编辑已有文章，不能直接删除、改名或新建文章。
新增选题时先按内容规划建立文章 ID、教程编号和目录项，再开放正文编辑。

## 发布流程

Pages CMS 的“发布教程到官网”按钮会启动 GitHub Actions：

1. 检查分类、文章 ID、相关文章和已启用素材；
2. 自动生成浏览器读取的合并内容；
3. 验证通过后部署整个静态官网到 Cloudflare Workers；
4. 验证失败时不会发布，Pages CMS 会显示失败状态。

发布会包含 GitHub 当前分支里已经保存的官网文件，不会包含电脑上未提交的修改。

## Local validation

教程现在从 JSON 内容文件读取，不能直接依赖 `file://` 打开。请通过本地 HTTP 预览：

```bash
python3 -m http.server 8801 --bind 127.0.0.1
```

至少检查：

- 帮助中心首页、分类页和文章页；
- 有结果和无结果的搜索；
- 1440、1024、768 和 390 像素宽度；
- 移动端菜单和横向分类导航；
- 键盘焦点和 `/` 搜索快捷键；
- 页面没有横向溢出；
- 浏览器控制台没有错误；
- 减少动态效果模式仍可正常阅读。

内容结构检查：

```bash
node scripts/validate-guide-content.mjs
node scripts/build-guide-content.mjs
```
