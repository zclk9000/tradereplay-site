import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const contentRoot = path.join(root, "content", "guide");
const catalog = JSON.parse(
  fs.readFileSync(path.join(contentRoot, "catalog.json"), "utf8")
);
const sourceArticles = catalog.articleFiles.map((filename) =>
  JSON.parse(
    fs.readFileSync(path.join(contentRoot, "articles", filename), "utf8")
  )
);
const readyIds = new Set(
  sourceArticles
    .filter((article) => article.status === "ready")
    .map((article) => article.id)
);
const articles = sourceArticles
  .filter((article) => article.status === "ready")
  .map((article) => {
    const publicArticle = JSON.parse(JSON.stringify(article));
    publicArticle.related = (publicArticle.related || []).filter((id) => readyIds.has(id));
    publicArticle.sections = (publicArticle.sections || []).map((section) => {
      if (!section.media?.ready) {
        delete section.media;
      } else {
        delete section.media.note;
      }
      return section;
    });
    return publicArticle;
  });
const categoryCounts = new Map();
for (const article of articles) {
  categoryCounts.set(article.category, (categoryCounts.get(article.category) || 0) + 1);
}
const categories = catalog.categories
  .filter((category) => categoryCounts.has(category.id))
  .map((category) => ({
    ...category,
    count: categoryCounts.get(category.id)
  }));
const output = {
  version: catalog.version,
  verifiedDate: catalog.verifiedDate,
  categories,
  articles
};
const outputPath = path.join(root, "guide-content.json");
const serializedOutput = `${JSON.stringify(output)}\n`;
const publicSource = `${fs.readFileSync(path.join(root, "guide.js"), "utf8")}\n${serializedOutput}`;
const forbiddenPublicPhrases = [
  "Mac App Store",
  "iOS",
  "已退役",
  "产品线",
  "不混入",
  "建设中",
  "规划文章",
  "截图占位",
  "视频占位"
];
const leakedPhrase = forbiddenPublicPhrases.find((phrase) => publicSource.includes(phrase));
if (leakedPhrase) {
  throw new Error(`公开教程包含内部制作信息：${leakedPhrase}`);
}

fs.writeFileSync(outputPath, serializedOutput);
console.log(`已生成公开教程 guide-content.json（${categories.length} 个分类，${articles.length} 篇文章）。`);
