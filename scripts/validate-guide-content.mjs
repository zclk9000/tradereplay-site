import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const publicRoot = path.join(root, "public");
const contentRoot = path.join(root, "content", "guide");
const catalogPath = path.join(contentRoot, "catalog.json");
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const englishRoot = path.join(contentRoot, "locales", "en");
const englishCatalogPath = path.join(englishRoot, "catalog.json");
const errors = [];
const warnings = [];

function report(condition, message) {
  if (!condition) errors.push(message);
}

report(Array.isArray(catalog.categories), "catalog.categories 必须是数组");
report(Array.isArray(catalog.articleFiles), "catalog.articleFiles 必须是数组");
report(fs.existsSync(englishCatalogPath), "英文教程目录不存在：locales/en/catalog.json");
let englishCatalog = { categories: [] };
if (fs.existsSync(englishCatalogPath)) {
  try {
    englishCatalog = JSON.parse(fs.readFileSync(englishCatalogPath, "utf8"));
  } catch (error) {
    errors.push(`英文教程目录 JSON 无法解析（${error.message}）`);
  }
}
report(englishCatalog.language === "en", "英文教程目录 language 必须是 en");
report(Array.isArray(englishCatalog.categories), "英文 catalog.categories 必须是数组");

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
const readyArticles = [];

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
    readyArticles.push(article);
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

const englishCategoryIds = new Set(
  (englishCatalog.categories || []).map((item) => item.id)
);
report(
  englishCategoryIds.size === categoryIds.size,
  `英文分类数量应为 ${categoryIds.size}，实际为 ${englishCategoryIds.size}`
);
for (const category of catalog.categories || []) {
  const translation = (englishCatalog.categories || []).find(
    (item) => item.id === category.id
  );
  report(translation, `英文教程缺少分类：${category.id}`);
  if (translation) {
    report(translation.title, `英文分类 ${category.id} 缺少 title`);
    report(translation.short, `英文分类 ${category.id} 缺少 short`);
    report(translation.description, `英文分类 ${category.id} 缺少 description`);
  }
}

function requiredEnglishText(value, label) {
  report(typeof value === "string" && value.trim(), `${label} 缺少英文内容`);
  if (typeof value === "string") {
    const cjkCheckValue = value.replaceAll("简体中文", "");
    report(!/[\u3400-\u9fff]/u.test(cjkCheckValue), `${label} 仍包含中文：${value}`);
  }
}

for (const article of readyArticles) {
  const filename = `${article.id}.json`;
  const translationPath = path.join(englishRoot, "articles", filename);
  report(fs.existsSync(translationPath), `英文教程缺少文章：${filename}`);
  if (!fs.existsSync(translationPath)) continue;

  let translation;
  try {
    translation = JSON.parse(fs.readFileSync(translationPath, "utf8"));
  } catch (error) {
    errors.push(`英文文章 JSON 无法解析：${filename}（${error.message}）`);
    continue;
  }
  const untranslatedText = JSON.stringify(translation).replaceAll("简体中文", "");
  report(
    !/[\u3400-\u9fff]/u.test(untranslatedText),
    `${article.id} 英文文章仍包含未翻译中文`
  );

  report(translation.id === article.id, `${filename} 的英文 id 与中文不一致`);
  report(translation.code === article.code, `${filename} 的英文 code 与中文不一致`);
  for (const field of ["title", "summary", "time", "level", "tier", "platform", "outcome"]) {
    requiredEnglishText(translation[field], `${article.id}.${field}`);
  }
  report(Array.isArray(translation.keywords) && translation.keywords.length > 0, `${article.id}.keywords 缺少英文内容`);
  report(Array.isArray(translation.before), `${article.id}.before 必须是数组`);
  report(Array.isArray(translation.success), `${article.id}.success 必须是数组`);
  report(Array.isArray(translation.faq), `${article.id}.faq 必须是数组`);
  report(Array.isArray(translation.sections), `${article.id}.sections 必须是数组`);
  if (!Array.isArray(translation.sections)) continue;

  report(
    translation.sections.length === (article.sections || []).length,
    `${article.id} 英文章节数量与中文不一致`
  );
  (article.sections || []).forEach((section, index) => {
    const translated = translation.sections[index];
    if (!translated) return;
    report(translated.id === section.id, `${article.id} 第 ${index + 1} 个英文章节 id 与中文不一致`);
    requiredEnglishText(translated.title, `${article.id}/${section.id}.title`);
    if (section.body) requiredEnglishText(translated.body, `${article.id}/${section.id}.body`);
    report(
      (translated.steps || []).length === (section.steps || []).length,
      `${article.id}/${section.id} 英文步骤数量与中文不一致`
    );
    report(
      (translated.bullets || []).length === (section.bullets || []).length,
      `${article.id}/${section.id} 英文要点数量与中文不一致`
    );
    if (section.callout) {
      report(translated.callout, `${article.id}/${section.id} 缺少英文提示框`);
      if (translated.callout) {
        report(translated.callout.tone === section.callout.tone, `${article.id}/${section.id} 英文提示框类型与中文不一致`);
        requiredEnglishText(translated.callout.title, `${article.id}/${section.id}.callout.title`);
        requiredEnglishText(translated.callout.body, `${article.id}/${section.id}.callout.body`);
      }
    }
    if (section.media) {
      report(translated.media, `${article.id}/${section.id} 缺少英文素材说明`);
      if (translated.media) {
        requiredEnglishText(translated.media.label, `${article.id}/${section.id}.media.label`);
        requiredEnglishText(translated.media.alt, `${article.id}/${section.id}.media.alt`);
      }
    }
  });
  report(
    (translation.faq || []).length === (article.faq || []).length,
    `${article.id} 英文常见问题数量与中文不一致`
  );
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
const englishDiskFiles = fs.existsSync(path.join(englishRoot, "articles"))
  ? fs.readdirSync(path.join(englishRoot, "articles")).filter((filename) => filename.endsWith(".json"))
  : [];
for (const filename of englishDiskFiles) {
  if (!catalog.articleFiles.includes(filename)) warnings.push(`没有中文对应文章的英文文件：${filename}`);
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
  `中英双语教程内容有效：${catalog.categories.length} 个分类，中文 ${articles.length} 篇文章，英文 ${readyArticles.length} 篇文章，${readyCount} 篇已发布，${mediaCount} 个素材位置。`
);
