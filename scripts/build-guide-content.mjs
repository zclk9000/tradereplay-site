import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const contentRoot = path.join(root, "content", "guide");
const catalog = JSON.parse(
  fs.readFileSync(path.join(contentRoot, "catalog.json"), "utf8")
);
const articles = catalog.articleFiles.map((filename) =>
  JSON.parse(
    fs.readFileSync(path.join(contentRoot, "articles", filename), "utf8")
  )
);
const output = {
  version: catalog.version,
  verifiedDate: catalog.verifiedDate,
  categories: catalog.categories,
  articles
};
const outputPath = path.join(root, "guide-content.json");

fs.writeFileSync(outputPath, `${JSON.stringify(output)}\n`);
console.log(`已生成 guide-content.json（${articles.length} 篇文章）。`);
