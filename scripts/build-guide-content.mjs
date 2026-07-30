import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const publicRoot = path.join(root, "public");
const contentRoot = path.join(root, "content", "guide");
const catalog = JSON.parse(
  fs.readFileSync(path.join(contentRoot, "catalog.json"), "utf8")
);
const englishRoot = path.join(contentRoot, "locales", "en");
const englishCatalog = JSON.parse(
  fs.readFileSync(path.join(englishRoot, "catalog.json"), "utf8")
);
const sourceArticles = catalog.articleFiles.map((filename) =>
  JSON.parse(
    fs.readFileSync(path.join(contentRoot, "articles", filename), "utf8")
  )
);
const englishTranslations = new Map(
  catalog.articleFiles.flatMap((filename, index) => {
    if (sourceArticles[index].status !== "ready") return [];
    const translation = JSON.parse(
      fs.readFileSync(path.join(englishRoot, "articles", filename), "utf8")
    );
    return [[translation.id, translation]];
  })
);
const readyIds = new Set(
  sourceArticles
    .filter((article) => article.status === "ready")
    .map((article) => article.id)
);
function publicMedia(media) {
  if (!media?.ready) return null;
  const output = JSON.parse(JSON.stringify(media));
  delete output.note;
  return output;
}

const articles = sourceArticles
  .filter((article) => article.status === "ready")
  .map((article) => {
    const publicArticle = JSON.parse(JSON.stringify(article));
    publicArticle.related = (publicArticle.related || []).filter((id) => readyIds.has(id));
    publicArticle.sections = (publicArticle.sections || []).map((section) => {
      const media = publicMedia(section.media);
      if (!media) {
        delete section.media;
      } else {
        section.media = media;
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
const englishCategoriesById = new Map(
  englishCatalog.categories.map((category) => [category.id, category])
);
const englishCategories = categories.map((category) => ({
  ...category,
  ...englishCategoriesById.get(category.id),
  number: category.number,
  tone: category.tone,
  icon: category.icon,
  count: category.count
}));
const englishArticles = articles.map((article) => {
  const translation = englishTranslations.get(article.id);
  const translatedSections = new Map(
    (translation.sections || []).map((section) => [section.id, section])
  );
  return {
    id: article.id,
    code: article.code,
    category: article.category,
    status: article.status,
    featured: article.featured,
    title: translation.title,
    summary: translation.summary,
    time: translation.time,
    level: translation.level,
    tier: translation.tier,
    platform: translation.platform,
    keywords: translation.keywords,
    outcome: translation.outcome,
    before: translation.before,
    sections: article.sections.map((section) => {
      const translated = JSON.parse(
        JSON.stringify(translatedSections.get(section.id))
      );
      if (section.media) {
        translated.media = {
          ...section.media,
          label: translated.media?.label || section.media.label,
          alt: translated.media?.alt || translated.media?.label || section.media.alt
        };
      } else {
        delete translated.media;
      }
      return translated;
    }),
    success: translation.success,
    faq: translation.faq,
    related: article.related
  };
});
const output = {
  version: catalog.version,
  verifiedDate: catalog.verifiedDate,
  categories,
  articles,
  locales: {
    en: {
      categories: englishCategories,
      articles: englishArticles
    }
  }
};
const outputPath = path.join(publicRoot, "data", "guide-content.json");
const serializedOutput = `${JSON.stringify(output)}\n`;
const publicSource = `${fs.readFileSync(path.join(publicRoot, "scripts", "guide.js"), "utf8")}\n${serializedOutput}`;
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
console.log(
  `已生成中英双语公开教程 guide-content.json（中文 ${categories.length} 个分类、${articles.length} 篇文章；英文 ${englishCategories.length} 个分类、${englishArticles.length} 篇文章）。`
);
