import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const publicRoot = path.join(root, "public");
const errors = [];
const checkedReferences = new Set();
const requiredPages = [
  "index.html",
  "download.html",
  "changelog.html",
  "guide.html",
  "support.html",
  "privacy.html",
  "terms.html",
  "refund.html",
];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
}

function report(condition, message) {
  if (!condition) errors.push(message);
}

function isExternalOrDynamic(value) {
  return /^(?:https?:|mailto:|tel:|data:|javascript:|\/\/|#|\?)/i.test(value);
}

function checkReference(sourcePath, rawValue) {
  const value = rawValue.trim();
  if (!value || isExternalOrDynamic(value)) return;

  const cleanValue = value.split(/[?#]/, 1)[0];
  if (!cleanValue) return;

  let decodedValue;
  try {
    decodedValue = decodeURIComponent(cleanValue);
  } catch {
    errors.push(`${path.relative(root, sourcePath)} 包含无法解析的路径：${value}`);
    return;
  }

  let targetPath = decodedValue.startsWith("/")
    ? path.join(publicRoot, decodedValue.replace(/^\/+/, ""))
    : path.resolve(path.dirname(sourcePath), decodedValue);

  if (!targetPath.startsWith(`${publicRoot}${path.sep}`) && targetPath !== publicRoot) {
    errors.push(`${path.relative(root, sourcePath)} 的路径越过 public/：${value}`);
    return;
  }

  if (decodedValue.endsWith("/")) targetPath = path.join(targetPath, "index.html");
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
    targetPath = path.join(targetPath, "index.html");
  }

  checkedReferences.add(`${path.relative(root, sourcePath)} -> ${value}`);
  report(
    fs.existsSync(targetPath),
    `${path.relative(root, sourcePath)} 引用了不存在的公开文件：${value}`
  );
}

report(fs.existsSync(publicRoot), "缺少 public/ 发布目录");
for (const page of requiredPages) {
  report(fs.existsSync(path.join(publicRoot, page)), `缺少公开页面：public/${page}`);
}

const wrangler = fs.readFileSync(path.join(root, "wrangler.toml"), "utf8");
report(
  /^\s*directory\s*=\s*"\.\/public"\s*$/m.test(wrangler),
  'wrangler.toml 的发布目录必须是 "./public"'
);

const pagesConfig = fs.readFileSync(path.join(root, ".pages.yml"), "utf8");
report(
  pagesConfig.includes("input: public/assets/cms"),
  ".pages.yml 的官网媒体目录必须是 public/assets/cms"
);
report(
  pagesConfig.includes("input: public/guide-assets"),
  ".pages.yml 的教程媒体目录必须是 public/guide-assets"
);

const publicFiles = fs.existsSync(publicRoot) ? walk(publicRoot) : [];
for (const filePath of publicFiles) {
  const extension = path.extname(filePath).toLowerCase();
  const source = [".html", ".css", ".js"].includes(extension)
    ? fs.readFileSync(filePath, "utf8")
    : "";

  if (extension === ".html") {
    for (const match of source.matchAll(/\s(?:href|src|poster)=["']([^"']+)["']/gi)) {
      checkReference(filePath, match[1]);
    }
  }

  if (extension === ".css") {
    for (const match of source.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
      checkReference(filePath, match[1]);
    }
  }

  if (extension === ".js") {
    for (const match of source.matchAll(/\bfetch\(\s*["'`]([^"'`]+)["'`]/g)) {
      checkReference(filePath, match[1]);
    }
  }
}

function checkContentMedia(value, label) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => checkContentMedia(item, `${label}.${index}`));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) =>
      checkContentMedia(item, `${label}.${key}`)
    );
    return;
  }
  if (
    typeof value === "string" &&
    /^\/?(?:assets|guide-assets)\//.test(value)
  ) {
    const targetPath = path.join(publicRoot, value.replace(/^\/+/, ""));
    report(fs.existsSync(targetPath), `${label} 引用了不存在的公开媒体：${value}`);
  }
}

const siteContentRoot = path.join(root, "content", "site");
for (const filePath of walk(siteContentRoot).filter((item) => item.endsWith(".json"))) {
  const json = JSON.parse(fs.readFileSync(filePath, "utf8"));
  checkContentMedia(json, path.relative(root, filePath));
}

const guideArticleRoot = path.join(root, "content", "guide", "articles");
for (const filePath of walk(guideArticleRoot).filter((item) => item.endsWith(".json"))) {
  const article = JSON.parse(fs.readFileSync(filePath, "utf8"));
  for (const [index, section] of (article.sections || []).entries()) {
    if (!section.media?.ready) continue;
    checkContentMedia(
      { file: section.media.file, poster: section.media.poster },
      `${path.relative(root, filePath)}.sections.${index}.media`
    );
  }
}

const productionExtensions = new Set([
  ".html",
  ".css",
  ".js",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".svg",
  ".mp4",
  ".webm",
]);
for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (entry.isFile() && productionExtensions.has(path.extname(entry.name).toLowerCase())) {
    errors.push(`项目根目录仍有应归类的网页或资源文件：${entry.name}`);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `错误：${error}`).join("\n"));
  process.exit(1);
}

console.log(
  `发布目录有效：${requiredPages.length} 个网页，${publicFiles.length} 个公开文件，${checkedReferences.size} 条本地引用。`
);
