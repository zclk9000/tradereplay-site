import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const publicRoot = path.join(root, "public");
const contentRoot = path.join(root, "content", "guide");
const catalogPath = path.join(contentRoot, "catalog.json");
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const errors = [];
const warnings = [];

function report(condition, message) {
  if (!condition) errors.push(message);
}

report(Array.isArray(catalog.categories), "catalog.categories 必须是数组");
report(Array.isArray(catalog.articleFiles), "catalog.articleFiles 必须是数组");

const categoryIds = new Set((catalog.categories || []).map((item) => item.id));
const articles = [];

for (const filename of catalog.articleFiles || []) {
  const articlePath = path.join(contentRoot, "articles", filename);
  if (!fs.existsSync(articlePath)) {
    errors.push(`文章文件不存在：${filename}`);
    continue;
  }
  try {
    articles.push(JSON.parse(fs.readFileSync(articlePath, "utf8")));
  } catch (error) {
    errors.push(`文章 JSON 无法解析：${filename}（${error.message}）`);
  }
}

const articleIds = new Set();
const articleCodes = new Set();

for (const article of articles) {
  report(article.id, "发现没有 id 的文章");
  report(article.code, `${article.id || "未知文章"} 缺少 code`);
  report(article.title, `${article.id || "未知文章"} 缺少 title`);
  report(categoryIds.has(article.category), `${article.id} 使用了不存在的分类 ${article.category}`);
  report(!articleIds.has(article.id), `文章 id 重复：${article.id}`);
  report(!articleCodes.has(article.code), `教程编号重复：${article.code}`);
  articleIds.add(article.id);
  articleCodes.add(article.code);

  if (article.status === "ready") {
    report(article.outcome, `${article.id} 已发布但缺少“完成后”`);
    report(Array.isArray(article.sections) && article.sections.length > 0, `${article.id} 已发布但没有正文章节`);
  }

  for (const section of article.sections || []) {
    report(section.id, `${article.id} 有章节缺少 id`);
    report(section.title, `${article.id} 有章节缺少 title`);
    const media = section.media;
    if (media?.ready) {
      report(media.file, `${article.id}/${section.id} 已标记素材就绪但没有文件`);
      if (media.file) {
        const relativeFile = media.file.replace(/^\/+/, "");
        report(fs.existsSync(path.join(publicRoot, relativeFile)), `${article.id}/${section.id} 素材文件不存在：${media.file}`);
      }
    }
  }
}

for (const article of articles) {
  for (const relatedId of article.related || []) {
    if (!articleIds.has(relatedId)) warnings.push(`${article.id} 的相关文章不存在：${relatedId}`);
  }
}

const diskFiles = fs
  .readdirSync(path.join(contentRoot, "articles"))
  .filter((filename) => filename.endsWith(".json"));
for (const filename of diskFiles) {
  if (!catalog.articleFiles.includes(filename)) warnings.push(`未加入目录的文章文件：${filename}`);
}

if (warnings.length) {
  console.warn(warnings.map((item) => `警告：${item}`).join("\n"));
}
if (errors.length) {
  console.error(errors.map((item) => `错误：${item}`).join("\n"));
  process.exit(1);
}

const readyCount = articles.filter((article) => article.status === "ready").length;
const mediaCount = articles.flatMap((article) => article.sections || []).filter((section) => section.media).length;
console.log(
  `教程内容有效：${catalog.categories.length} 个分类，${articles.length} 篇文章，${readyCount} 篇已发布，${mediaCount} 个素材位置。`
);
