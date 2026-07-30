# AGENTS.md — TradeReplay 官网协作入口

> 所有 AI、自动化工具和开发任务进入本仓库后先读本文件。目录边界、
> 内容生成关系和发布规则以这里链接的文档为准。

## 项目边界

- 本仓库是 `tradereplay.dev` 官网的唯一正式源码：
  `/Users/charlie/ClaudeCode/tradereplay-site`。
- TradeReplay 桌面应用源码位于独立仓库
  `/Users/charlie/ClaudeCode/TradeReplay`，不要在两个仓库之间复制官网页面。
- 正式发布边界只有 `public/`。`content/`、`scripts/`、`docs/` 和本地资料
  不会部署。
- 活动桌面渠道只有官网直售的 Windows 安装包和 Mac DMG。不得恢复
  Mac App Store 购买入口。
- 不使用收益承诺、荐股/喊单语言、虚假紧迫感或无法证明的市场覆盖声明。

## 必读文档

| 事项 | 权威文件 |
| --- | --- |
| 目录职责、页面和素材索引 | `docs/PROJECT_STRUCTURE.md` |
| 开发、设计约束和发布前验证 | `docs/DEVELOPMENT.md` |
| 视觉系统和品牌语言 | `docs/DESIGN.md` |
| 教程内容维护 | `docs/HELP_CENTER.md` |
| 本地启动、生成、验证和部署入口 | `README.md` |

不要创建内容重复的第二份规范；需要调整规则时修改上述权威文件。

## 目录与 Git 规则

- `public/`：可发布网页、压缩后的正式图片/视频及生成结果，进入 Git。
- `content/`：Pages CMS 和生成脚本使用的源内容，进入 Git。
- `scripts/`、`worker/`、`docs/`、`.github/`：工具、Worker、文档和 CI，进入 Git。
- `_local/`：官网相关的原始截图、源视频和设计材料，不进入 Git。
- `.artifacts/<日期>/<任务>/`：AI 截图、浏览器快照、审计报告、渲染结果和
  临时实验，不进入 Git。
- `.private/`：账号截图、令牌、密钥和商业敏感资料的临时隔离区，不进入 Git；
  长期凭据应放入系统钥匙串或正式密钥管理位置。
- `.wrangler/`、`node_modules/`、日志和缓存不进入 Git。

根目录只保留项目入口和配置。不得把截图、视频、页面镜像、临时 HTML、
审计目录或 AI 中间文件放在根目录。

## 内容和素材规则

- 修改 `content/site/*.json` 后运行 `node scripts/build-site-content.mjs`；
  不直接修改 `public/scripts/site-content.generated.js`。
- 修改 `content/guide/` 后运行 `node scripts/build-guide-content.mjs`；
  不直接修改 `public/data/guide-content.json`。
- 新的正式素材按用途进入 `public/assets/` 对应分类，使用可理解的英文文件名。
- 原始大图和源视频留在 `_local/`；`public/` 只保留经过压缩、确认引用的成品。
- 禁止把第三方网页镜像、浏览器扩展注入页面或来源不明的品牌素材当作官网源码。
- 删除 `public/assets/legacy/` 或旧教程截图前，必须先确认页面和内容数据均无引用。

## 多任务协作

- 新任务默认使用独立 Git worktree，统一放到
  `/Users/charlie/ClaudeCode/TradeReplay/.worktrees/<site-task>/`，不要在
  `/Users/charlie/ClaudeCode/` 下再创建 `tradereplay-site-copy`、`preview`
  或 `bak` 一类并列副本。
- 每个任务只提交自己明确修改的文件，不得顺手提交其他任务的页面、截图或素材。
- 移动可能被其他任务使用的目录前，先检查任务状态并通知对应任务；移动后提供
  精确新路径。
- worktree 必须用 `git worktree move/remove/repair` 管理，不得通过 Finder
  拖动或直接删除。

## 提交与发布

- 提交前运行 README 中的完整验证命令，并检查 `git status`。
- 每个未忽略的状态项都必须属于本次任务；无关文件不得混入提交。
- Git push 不等于发布。生产部署必须获得用户明确授权。
- 正常生产发布只走 Pages CMS 的“发布当前官网（含教程）”工作流。
- 不得从另一个任务手动运行生产 `wrangler deploy`，除非用户明确要求改变
  既定发布流程。
- `wrangler.toml` 的发布目录必须保持为 `./public`；Cloudflare 路由继续由
  控制台管理，不要擅自写回配置文件。

## 发布前验证

在仓库根目录依次运行：

```bash
node scripts/check-repo-hygiene.mjs
node scripts/build-site-content.mjs
node scripts/validate-site-content-bindings.mjs
node scripts/validate-guide-content.mjs
node scripts/build-guide-content.mjs
node scripts/validate-public-site.mjs
```

CI 和正式发布工作流会在重新生成内容后执行 `git diff --exit-code`，因此源内容
对应的生成文件必须在同一提交中更新。

页面验证必须通过 HTTP 预览，至少检查中文、英文预览、桌面和移动宽度、下载链接、
教程、法律页面、三段视频及浏览器控制台。
