(() => {
  const content = window.TRADE_REPLAY_SITE_CONTENT;
  if (!content) return;

  function get(path) {
    return path.split(".").reduce((value, key) => value?.[key], content);
  }

  function language() {
    const query = new URLSearchParams(window.location.search).get("lang");
    if (query === "zh" || query === "en") return query;
    const htmlLanguage = document.documentElement.lang?.toLowerCase();
    if (htmlLanguage?.startsWith("zh")) return "zh";
    try {
      const saved = window.localStorage.getItem("tradereplay-language");
      if (saved === "zh" || saved === "en") return saved;
    } catch {
      // Local storage is optional.
    }
    return window.navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
  }

  function localized(value, lang = language()) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value[lang] ?? value.zh ?? value.en ?? "";
    }
    return value ?? "";
  }

  function applyText(node, value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      node.dataset.zh = value.zh ?? "";
      node.dataset.en = value.en ?? "";
    }
    node.textContent = localized(value);
  }

  function applyHref(node, value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      node.dataset.hrefZh = value.zh ?? "";
      node.dataset.hrefEn = value.en ?? "";
    }
    node.href = localized(value);
  }

  function renderReleaseList(node, mode) {
    const highlights = content.release.highlights || [];
    const lang = mode.endsWith("-en") ? "en" : "zh";
    const changelog = mode.startsWith("changelog");
    const labels = {
      new: { zh: "新增", en: "New" },
      improved: { zh: "优化", en: "Improved" },
      fixed: { zh: "修复", en: "Fixed" },
    };
    node.replaceChildren(
      ...highlights.map((item) => {
        const row = document.createElement("li");
        const tag = document.createElement("span");
        const text = document.createElement("span");
        tag.className = changelog
          ? `tag tag-${item.type === "improved" ? "improve" : item.type === "fixed" ? "fix" : "new"}`
          : `download-release-tag is-${item.type}`;
        if (changelog) {
          tag.textContent = labels[item.type]?.[lang] ?? item.type;
          text.textContent = item[lang];
        } else {
          tag.dataset.zh = labels[item.type]?.zh ?? item.type;
          tag.dataset.en = (labels[item.type]?.en ?? item.type).toUpperCase();
          text.dataset.zh = item.zh;
          text.dataset.en = item.en;
          tag.textContent = localized({ zh: tag.dataset.zh, en: tag.dataset.en });
          text.textContent = localized(item);
        }
        row.append(tag, text);
        return row;
      })
    );
  }

  document.querySelectorAll("[data-content-text]").forEach((node) => {
    const value = get(node.dataset.contentText);
    if (value !== undefined) applyText(node, value);
  });

  document.querySelectorAll("[data-content-href]").forEach((node) => {
    const value = get(node.dataset.contentHref);
    if (value !== undefined) applyHref(node, value);
  });

  document.querySelectorAll("[data-content-src]").forEach((node) => {
    const value = get(node.dataset.contentSrc);
    if (typeof value === "string" && value) node.src = value;
  });

  document.querySelectorAll("[data-content-alt]").forEach((node) => {
    const value = get(node.dataset.contentAlt);
    if (value === undefined) return;
    if (value && typeof value === "object") {
      node.dataset.altZh = value.zh ?? "";
      node.dataset.altEn = value.en ?? "";
    }
    node.alt = localized(value);
  });

  document.querySelectorAll("[data-content-list]").forEach((node) => {
    const values = get(node.dataset.contentList);
    if (!Array.isArray(values)) return;
    node.replaceChildren(
      ...values.map((value) => {
        const item = document.createElement("li");
        if (value && typeof value === "object") {
          item.dataset.zh = value.zh ?? "";
          item.dataset.en = value.en ?? "";
        }
        item.textContent = localized(value);
        return item;
      })
    );
  });

  document.querySelectorAll("[data-content-release-list]").forEach((node) => {
    renderReleaseList(node, node.dataset.contentReleaseList);
  });

  document.querySelectorAll("[data-content-email]").forEach((node) => {
    const value = get(node.dataset.contentEmail);
    if (typeof value !== "string" || !value) return;
    node.textContent = value;
    node.href = `mailto:${value}`;
  });

  document.querySelectorAll("[data-content-group-number]").forEach((node) => {
    const value = get(node.dataset.contentGroupNumber);
    if (typeof value !== "string" || !value) return;
    applyText(node, { zh: `群号 ${value}`, en: `Group ${value}` });
  });

  const descriptions = {
    privacy: content.legal.privacyDescription,
    terms: content.legal.termsDescription,
    refund: content.legal.refundDescription,
  };
  const page = document.body?.dataset.page;
  if (descriptions[page]) {
    document.body.dataset.descriptionZh = descriptions[page].zh;
    document.body.dataset.descriptionEn = descriptions[page].en;
  }
})();
