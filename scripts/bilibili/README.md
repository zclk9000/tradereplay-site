# B 站视频制作工具

这里是可通过 Git 同步的制作源码与必需素材。原文件来自 `_local/bilibili-cover/`
和 `_local/bilibili/episode-01/`；原目录保留作历史资料，后续修改以本目录为准。
本目录位于官网仓库 `tradereplay-site`，不会随 `public/` 部署到官网。

## 在其他电脑使用封面生成器

1. 在 `tradereplay-site` 仓库执行 `git pull --ff-only origin main`。
2. 双击打开 [TradeReplay-Bilibili-cover-maker.html](cover-maker/TradeReplay-Bilibili-cover-maker.html)。
3. 输入题目和集数，调整字号，点击“导出高清 PNG”。

可在 Windows / macOS 的 Edge、Chrome 等现代浏览器中使用。图片、截图和 Logo
已经内嵌，打开和导出都不需要联网，不需要安装 Node.js。输出为 **3200 × 2000，
16:10**；字体使用本机的苹方或微软雅黑，因此不同系统的文字宽度可能略有区别。

## 修改和重新构建封面工具

安装 Node.js 18 或更高版本后，在仓库根目录运行，无需 `npm install`：

```bash
node scripts/bilibili/cover-maker/build-cover-maker.mjs
```

构建脚本根据自身位置查找素材，也支持从其他工作目录传入脚本路径运行。

| 文件 | 用途 |
| --- | --- |
| `cover-maker/cover-maker.source.html` | 界面、Canvas 排版、标题和导出代码；编辑这个文件 |
| `cover-maker/build-cover-maker.mjs` | 把三份素材内嵌为单文件 HTML |
| `cover-maker/tradereplay-cover-background.png` | 封面和大字卡片共用背景 |
| `cover-maker/tradereplay-training-screen.png` | 封面上的软件截图 |
| `cover-maker/tradereplay-logo-dark.svg` | 品牌 Logo |
| `cover-maker/TradeReplay-Bilibili-cover-maker.html` | 可直接双击使用的构建结果，与源码一起提交 |

支持自动折行、手动换行、64–150 的字号调节和集数编辑。题目建议 8–18 个汉字、
最多两行。修改源码或素材后，重新构建并把源码与 HTML 一起提交。
日常导出的封面图片留在本地视频工作区，不加入这里。

## 第一集开场大字卡片

这部分复用封面背景，包含 [Swift 渲染脚本](episode-01/render_intro_cards.swift)、
[最终口播](episode-01/voiceover-final.txt) 和 [卡片顺序说明](episode-01/intro-card-timing.md)。

渲染脚本依赖 macOS AppKit 和 Xcode Command Line Tools，**只能在 Mac 上运行**。
封面生成器不受此限制。

```bash
# 生成全部 36 张 4K JPG 卡片及剪辑顺序说明
swift scripts/bilibili/episode-01/render_intro_cards.swift

# 只重做第 1 张
swift scripts/bilibili/episode-01/render_intro_cards.swift 1
```

生成结果位于本仓库的 `_local/bilibili/episode-01/intro-cards/`，规格为
**3840 × 2160，16:9**；同级 `intro-card-timing.md` 为同步生成的剪辑说明。
输出目录会自动创建，不需要从旧电脑复制 `_local/`。
需要保存到其他位置时，可以设置环境变量 `TR_BILIBILI_OUTPUT_DIR`；它指定包含
`intro-cards/` 和剪辑说明的输出目录。
卡片文案、顺序、布局和建议时长集中在 Swift 脚本的 `cards` 数组中。
修改后将新生成的剪辑说明同步到 `scripts/bilibili/episode-01/intro-card-timing.md`。

录像、录音、历史封面、批量渲染结果、缓存和账号资料仍保留在本地；Git 中包含
重新生成这些封面和卡片所需的代码与素材。
