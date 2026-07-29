import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const sourceRoot = path.join(root, "content", "site");
const files = ["home", "release", "support", "legal"];
const data = Object.fromEntries(
  files.map((name) => [
    name,
    JSON.parse(fs.readFileSync(path.join(sourceRoot, `${name}.json`), "utf8")),
  ])
);
const errors = [];

function requireText(value, label) {
  if (typeof value !== "string" || !value.trim()) errors.push(`${label} 不能为空`);
}

function requireLocalized(value, label) {
  requireText(value?.zh, `${label}.zh`);
  requireText(value?.en, `${label}.en`);
}

function requireWebUrl(value, label) {
  requireText(value, label);
  if (value && !/^https:\/\//.test(value)) errors.push(`${label} 必须使用 https://`);
}

function requireLink(value, label) {
  requireText(value, label);
  if (value && !/^(?:https:\/\/|[a-z0-9][a-z0-9./?&=_#%-]*$)/i.test(value)) {
    errors.push(`${label} 必须是站内相对链接或 https:// 完整链接`);
  }
}

function requireLocalImage(value, label) {
  requireText(value, label);
  const localPath = value?.replace(/^\/+/, "");
  if (localPath && !fs.existsSync(path.join(root, localPath))) {
    errors.push(`${label} 文件不存在：${value}`);
  }
}

requireLocalized(data.home.hero.eyebrow, "home.hero.eyebrow");
requireLocalized(data.home.hero.title, "home.hero.title");
requireLocalized(data.home.hero.subtitle, "home.hero.subtitle");
requireLocalized(data.home.hero.primaryButton?.label, "home.hero.primaryButton.label");
requireLink(data.home.hero.primaryButton?.href?.zh, "home.hero.primaryButton.href.zh");
requireLink(data.home.hero.primaryButton?.href?.en, "home.hero.primaryButton.href.en");
requireLocalized(data.home.hero.secondaryButton?.label, "home.hero.secondaryButton.label");
requireLink(data.home.hero.secondaryButton?.href?.zh, "home.hero.secondaryButton.href.zh");
requireLink(data.home.hero.secondaryButton?.href?.en, "home.hero.secondaryButton.href.en");
requireLocalImage(data.home.hero.image, "home.hero.image");
requireLocalized(data.home.hero.imageAlt, "home.hero.imageAlt");
requireLocalized(data.home.showcase.kicker, "home.showcase.kicker");
requireLocalized(data.home.showcase.title, "home.showcase.title");
requireLocalized(data.home.showcase.intro, "home.showcase.intro");
for (const key of ["system", "simulation", "scan", "statements", "statistics", "journal"]) {
  const item = data.home.showcase[key];
  requireLocalized(item?.tab, `home.showcase.${key}.tab`);
  requireLocalized(item?.title, `home.showcase.${key}.title`);
  if (!Array.isArray(item?.bullets) || item.bullets.length < 1) {
    errors.push(`home.showcase.${key}.bullets 至少需要一项`);
  } else {
    item.bullets.forEach((bullet, index) =>
      requireLocalized(bullet, `home.showcase.${key}.bullets.${index}`)
    );
  }
  requireLocalImage(item?.image, `home.showcase.${key}.image`);
  requireLocalized(item?.imageAlt, `home.showcase.${key}.imageAlt`);
}
requireLocalized(data.home.pricing.kicker, "home.pricing.kicker");
requireLocalized(data.home.pricing.title, "home.pricing.title");
requireLocalized(data.home.pricing.proLicense, "home.pricing.proLicense");
requireLocalized(data.home.pricing.purchaseLabel, "home.pricing.purchaseLabel");
requireWebUrl(data.home.pricing.taobaoUrl, "home.pricing.taobaoUrl");
requireWebUrl(data.home.pricing.whopUrl, "home.pricing.whopUrl");
data.home.pricing.purchaseUrl = {
  zh: data.home.pricing.taobaoUrl,
  en: data.home.pricing.whopUrl,
};
requireLocalized(data.home.finalCta.kicker, "home.finalCta.kicker");
requireLocalized(data.home.finalCta.title, "home.finalCta.title");
requireLocalized(data.home.finalCta.description, "home.finalCta.description");
requireText(data.release.version, "release.version");
requireText(data.release.displayVersion, "release.displayVersion");
if (data.release.displayVersion !== `v${data.release.version}`) {
  errors.push("release.displayVersion 应为 v 加版本号");
}
requireText(data.release.date, "release.date");
if (data.release.date && !/^\d{4}-\d{2}-\d{2}$/.test(data.release.date)) {
  errors.push("release.date 必须使用 YYYY-MM-DD 格式");
}
requireLocalized(data.release.downloadIntro, "release.downloadIntro");
requireWebUrl(data.release.windows.url, "release.windows.url");
requireWebUrl(data.release.mac.url, "release.mac.url");
for (const platform of ["windows", "mac"]) {
  const item = data.release[platform];
  requireText(item?.fileName, `release.${platform}.fileName`);
  requireText(item?.installerLabel, `release.${platform}.installerLabel`);
  requireLocalized(item?.summary, `release.${platform}.summary`);
  requireLocalized(item?.button, `release.${platform}.button`);
}
if (!Array.isArray(data.release.highlights) || data.release.highlights.length < 1) {
  errors.push("release.highlights 至少需要一项");
}
for (const [index, item] of (data.release.highlights || []).entries()) {
  if (!["new", "improved", "fixed"].includes(item.type)) {
    errors.push(`release.highlights.${index}.type 无效`);
  }
  requireText(item.zh, `release.highlights.${index}.zh`);
  requireText(item.en, `release.highlights.${index}.en`);
}
requireLocalized(data.support.heading, "support.heading");
requireLocalized(data.support.guide?.title, "support.guide.title");
requireLocalized(data.support.guide?.description, "support.guide.description");
requireLink(data.support.guide?.link?.zh, "support.guide.link.zh");
requireLink(data.support.guide?.link?.en, "support.guide.link.en");
requireLocalized(data.support.guide?.button, "support.guide.button");
requireLocalized(data.support.qq?.title, "support.qq.title");
requireText(data.support.qq?.number, "support.qq.number");
requireWebUrl(data.support.qq.joinUrl, "support.qq.joinUrl");
requireLocalized(data.support.qq?.button, "support.qq.button");
requireLocalImage(data.support.qq.qrImage, "support.qq.qrImage");
requireLocalImage(data.support.qq.iconImage, "support.qq.iconImage");
requireLocalized(data.support.wecom?.title, "support.wecom.title");
requireLocalized(data.support.wecom?.description, "support.wecom.description");
requireLocalized(data.support.wecom?.button, "support.wecom.button");
requireLocalImage(data.support.wecom.qrImage, "support.wecom.qrImage");
requireLocalImage(data.support.wecom.iconImage, "support.wecom.iconImage");
requireText(data.support.email, "support.email");
if (data.support.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.support.email)) {
  errors.push("support.email 格式无效");
}
requireLocalized(data.legal.updated, "legal.updated");
requireText(data.legal.supportEmail, "legal.supportEmail");
if (data.legal.supportEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.legal.supportEmail)) {
  errors.push("legal.supportEmail 格式无效");
}
requireLocalized(data.legal.privacyDescription, "legal.privacyDescription");
requireLocalized(data.legal.termsDescription, "legal.termsDescription");
requireLocalized(data.legal.refundDescription, "legal.refundDescription");

if (errors.length) {
  console.error(errors.map((error) => `错误：${error}`).join("\n"));
  process.exit(1);
}

const payload = JSON.stringify(data).replaceAll("<", "\\u003c");
const output = `window.TRADE_REPLAY_SITE_CONTENT = ${payload};\n`;
fs.writeFileSync(path.join(root, "site-content.generated.js"), output);
console.log(
  `已生成官网内容：6 个功能展示，${data.release.highlights.length} 条最新版本说明。`
);
