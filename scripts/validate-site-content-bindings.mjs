import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const pages = [
  "index.html",
  "download.html",
  "changelog.html",
  "support.html",
  "privacy.html",
  "terms.html",
  "refund.html",
];
const content = Object.fromEntries(
  ["home", "release", "support", "legal"].map((name) => [
    name,
    JSON.parse(fs.readFileSync(path.join(root, "content", "site", `${name}.json`), "utf8")),
  ])
);
content.home.pricing.purchaseUrl = {
  zh: content.home.pricing.taobaoUrl,
  en: content.home.pricing.whopUrl,
};

const bindingPattern =
  /\bdata-content-(?:text|href|src|alt|list|email|group-number)="([^"]+)"/g;
const errors = [];
let bindingCount = 0;

function get(valuePath) {
  return valuePath.split(".").reduce((value, key) => value?.[key], content);
}

for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), "utf8");
  const hasBindings = html.includes("data-content-");
  if (hasBindings) {
    const generatedIndex = html.indexOf('src="site-content.generated.js"');
    const runtimeIndex = html.indexOf('src="site-content-runtime.js"');
    if (generatedIndex < 0 || runtimeIndex < 0 || generatedIndex > runtimeIndex) {
      errors.push(`${page} 缺少官网内容脚本，或脚本顺序不正确`);
    }
  }

  for (const match of html.matchAll(bindingPattern)) {
    bindingCount += 1;
    if (get(match[1]) === undefined) {
      errors.push(`${page} 引用了不存在的官网内容字段：${match[1]}`);
    }
  }
}

if (errors.length) {
  console.error(errors.map((error) => `错误：${error}`).join("\n"));
  process.exit(1);
}

console.log(`官网页面绑定有效：${pages.length} 个页面，${bindingCount} 个内容字段。`);
