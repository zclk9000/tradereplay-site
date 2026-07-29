(async function () {
  "use strict";

  let guide = window.TRADE_REPLAY_GUIDE;
  const view = document.querySelector("[data-guide-view]");
  const loading = document.querySelector("[data-guide-loading]");
  const progress = document.querySelector("[data-reading-progress]");
  const menuButton = document.querySelector("[data-guide-menu]");
  const menu = document.querySelector("[data-guide-nav]");
  const searchDialog = document.querySelector("[data-search-dialog]");
  const modalSearch = document.querySelector("[data-modal-search]");
  const modalResults = document.querySelector("[data-modal-results]");

  if (!guide && window.TRADE_REPLAY_GUIDE_READY) {
    try {
      guide = await window.TRADE_REPLAY_GUIDE_READY;
    } catch (error) {
      console.error("TradeReplay guide content failed to load.", error);
    }
  }

  if (!guide || !view) {
    if (loading) {
      loading.innerHTML =
        '<p>教程目录暂时无法载入，请刷新页面或前往<a href="support.html">支持页面</a>。</p>';
    }
    return;
  }

  const publicArticles = guide.articles.filter((item) => item.status === "ready");
  const publicCategoryIds = new Set(publicArticles.map((item) => item.category));
  const publicCategories = guide.categories.filter((item) => publicCategoryIds.has(item.id));
  const categoriesById = new Map(publicCategories.map((item) => [item.id, item]));
  const articlesById = new Map(publicArticles.map((item) => [item.id, item]));

  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function sanitizeRichHTML(value) {
    if (!value) return "";

    const template = document.createElement("template");
    template.innerHTML = String(value);
    const allowedTags = new Set([
      "A",
      "BLOCKQUOTE",
      "BR",
      "CODE",
      "EM",
      "FIGCAPTION",
      "FIGURE",
      "H3",
      "H4",
      "HR",
      "IMG",
      "LI",
      "OL",
      "P",
      "PRE",
      "STRONG",
      "TABLE",
      "TBODY",
      "TD",
      "TH",
      "THEAD",
      "TR",
      "UL"
    ]);
    const removeEntirely = new Set([
      "BUTTON",
      "EMBED",
      "FORM",
      "IFRAME",
      "INPUT",
      "LINK",
      "META",
      "OBJECT",
      "SCRIPT",
      "STYLE",
      "SVG"
    ]);

    function safeURL(url, allowLocalOnly = false) {
      const normalized = String(url || "").trim();
      if (!normalized) return "";
      if (normalized.startsWith("#")) return normalized;
      if (
        normalized.startsWith("/") ||
        normalized.startsWith("./") ||
        normalized.startsWith("../")
      ) {
        return normalized;
      }
      if (allowLocalOnly) return "";
      try {
        const parsed = new URL(normalized, window.location.href);
        return ["http:", "https:", "mailto:"].includes(parsed.protocol) ? normalized : "";
      } catch {
        return "";
      }
    }

    function clean(node) {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.COMMENT_NODE) {
          child.remove();
          return;
        }
        if (child.nodeType !== Node.ELEMENT_NODE) return;

        if (removeEntirely.has(child.tagName)) {
          child.remove();
          return;
        }
        if (!allowedTags.has(child.tagName)) {
          clean(child);
          child.replaceWith(...child.childNodes);
          return;
        }

        const allowedAttributes =
          child.tagName === "A"
            ? new Set(["href", "title"])
            : child.tagName === "IMG"
              ? new Set(["src", "alt", "title", "width", "height"])
              : new Set();

        Array.from(child.attributes).forEach((attribute) => {
          if (!allowedAttributes.has(attribute.name.toLowerCase())) {
            child.removeAttribute(attribute.name);
          }
        });

        if (child.tagName === "A") {
          const href = safeURL(child.getAttribute("href"));
          if (href) {
            child.setAttribute("href", href);
            if (/^https?:/i.test(href)) {
              child.setAttribute("target", "_blank");
              child.setAttribute("rel", "noopener noreferrer");
            }
          } else {
            child.removeAttribute("href");
          }
        }

        if (child.tagName === "IMG") {
          const src = safeURL(child.getAttribute("src"), true);
          if (!src) {
            child.remove();
            return;
          }
          child.setAttribute("src", src);
          child.setAttribute("loading", "lazy");
          child.setAttribute("decoding", "async");
        }

        clean(child);
      });
    }

    clean(template.content);
    return template.innerHTML;
  }

  function icon(name, className = "") {
    const icons = {
      compass: '<circle cx="12" cy="12" r="8.5"></circle><path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9 4.9-2.1Z"></path>',
      database: '<ellipse cx="12" cy="6" rx="7.5" ry="3"></ellipse><path d="M4.5 6v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6M4.5 12v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6"></path>',
      chart: '<path d="M4 19V9m5 10V5m5 14v-7m5 7V3"></path>',
      shield: '<path d="M12 3 5.5 5.8v5.4c0 4.1 2.5 7.5 6.5 9.8 4-2.3 6.5-5.7 6.5-9.8V5.8L12 3Z"></path><path d="m9.2 12 1.8 1.8 3.8-4"></path>',
      notebook: '<path d="M6 3.5h11a2 2 0 0 1 2 2v15H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 1-1.7"></path><path d="M8 3v18M11 8h5M11 12h5"></path>',
      receipt: '<path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21V3Z"></path><path d="M9 8h6M9 12h6M9 16h4"></path>',
      activity: '<path d="M3 12h4l2-6 4 12 2-6h6"></path>',
      workflow: '<rect x="3" y="4" width="6" height="5" rx="1"></rect><rect x="15" y="15" width="6" height="5" rx="1"></rect><path d="M9 6.5h3a4 4 0 0 1 4 4V15M15 17.5h-3a4 4 0 0 1-4-4V9"></path>',
      spark: '<path d="m12 3 1.5 4.2L18 9l-4.5 1.8L12 15l-1.5-4.2L6 9l4.5-1.8L12 3Z"></path><path d="m18.5 15 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z"></path>',
      sliders: '<path d="M4 6h5m4 0h7M9 3v6M4 18h9m4 0h3M17 15v6M4 12h2m4 0h10M10 9v6"></path>',
      lifebuoy: '<circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="3.5"></circle><path d="m5.6 5.6 3.9 3.9m5 5 3.9 3.9m0-12.8-3.9 3.9m-5 5-3.9 3.9"></path>',
      arrow: '<path d="M5 12h14m-5-5 5 5-5 5"></path>',
      chevron: '<path d="m9 6 6 6-6 6"></path>',
      camera: '<path d="M5 7.5h3l1.2-2h5.6l1.2 2h3a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5a2 2 0 0 1 2-2Z"></path><circle cx="12" cy="13.5" r="3.5"></circle>',
      play: '<path d="m9 7 8 5-8 5V7Z"></path>',
      info: '<circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 8h.01"></path>',
      warning: '<path d="M11.1 4.5 3.5 18a1.7 1.7 0 0 0 1.5 2.5h14a1.7 1.7 0 0 0 1.5-2.5L12.9 4.5a1 1 0 0 0-1.8 0Z"></path><path d="M12 9v4M12 17h.01"></path>',
      security: '<rect x="5" y="10" width="14" height="10" rx="2"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2"></path>',
      check: '<circle cx="12" cy="12" r="9"></circle><path d="m8 12 2.5 2.5L16 9"></path>',
      file: '<path d="M6 3h8l4 4v14H6V3Z"></path><path d="M14 3v5h5M9 13h6M9 17h4"></path>',
      search: '<circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path>'
    };
    return `<svg class="${escapeHTML(className)}" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.info}</svg>`;
  }

  function articleHref(article) {
    return `guide.html?article=${encodeURIComponent(article.id)}`;
  }

  function categoryHref(category) {
    return `guide.html?category=${encodeURIComponent(category.id)}`;
  }

  function getCategory(article) {
    return categoriesById.get(article.category);
  }

  function setDocumentMeta(title, description) {
    document.title = `${title} — TradeReplay 帮助中心`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) meta.setAttribute("content", description);
  }

  function breadcrumbs(items) {
    return `
      <nav class="hc-breadcrumbs" aria-label="面包屑">
        <a href="guide.html">帮助中心</a>
        ${items
          .map(
            (item) =>
              `${icon("chevron")}${
                item.href
                  ? `<a href="${escapeHTML(item.href)}">${escapeHTML(item.label)}</a>`
                  : `<span aria-current="page">${escapeHTML(item.label)}</span>`
              }`
          )
          .join("")}
      </nav>`;
  }

  function sideRail(currentCategoryId) {
    return `
      <aside class="hc-side-rail" aria-label="教程分类">
        <p class="hc-side-rail-label">教程分类</p>
        <nav class="hc-side-nav">
          ${publicCategories
            .map(
              (category) => `
                <a href="${categoryHref(category)}"${
                  currentCategoryId === category.id ? ' aria-current="page"' : ""
                }>
                  <span class="hc-side-number">${category.number}</span>
                  <span>${escapeHTML(category.short)}</span>
                </a>`
            )
            .join("")}
        </nav>
      </aside>`;
  }

  function categoryIcon(category) {
    return `
      <span class="hc-category-icon" aria-hidden="true">
        ${icon(category.icon)}
      </span>`;
  }

  function renderSearchResults(query, target) {
    const normalized = query.trim().toLocaleLowerCase("zh-CN");
    if (!normalized) {
      target.innerHTML = "";
      return;
    }

    const matches = publicArticles
      .map((article) => {
        const category = getCategory(article);
        const haystack = [
          article.code,
          article.title,
          article.summary,
          ...(article.keywords || []),
          category ? category.title : ""
        ]
          .join(" ")
          .toLocaleLowerCase("zh-CN");
        const score =
          article.title.toLocaleLowerCase("zh-CN").includes(normalized) ? 4 :
          (article.keywords || []).some((item) =>
            item.toLocaleLowerCase("zh-CN").includes(normalized)
          ) ? 3 :
          haystack.includes(normalized) ? 1 : 0;
        return { article, category, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 9);

    if (!matches.length) {
      target.innerHTML = `
        <div class="hc-search-empty">
          <strong>暂时没有找到“${escapeHTML(query)}”</strong>
          <p>试试更短的词，例如“CFMMC”“止损”“资料库”“回测”或复制软件里的错误提示。</p>
        </div>`;
      return;
    }

    target.innerHTML = matches
      .map(({ article, category }) => {
        const content = `
          <span>
            <strong>${escapeHTML(article.title)}</strong>
            <small>${escapeHTML(category.title)} · ${escapeHTML(article.summary)}</small>
          </span>
          <span class="hc-search-result-code">${article.code}</span>`;
        return `<a class="hc-search-result" href="${articleHref(article)}">${content}</a>`;
      })
      .join("");
  }

  function attachSearch(input, results) {
    if (!input || !results) return;
    input.addEventListener("input", () => renderSearchResults(input.value, results));
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        input.value = "";
        results.innerHTML = "";
        input.blur();
      }
    });
  }

  function renderHome() {
    setDocumentMeta(
      "TradeReplay 官方教程",
      "按任务查找 TradeReplay 使用教程、功能说明、设置与故障排查。"
    );
    const featured = publicArticles.filter((article) => article.featured);
    view.innerHTML = `
      <section class="hc-home-hero" aria-labelledby="help-title">
        <div class="hc-shell hc-home-hero-inner">
          <p class="hc-kicker">TRADEREPLAY HELP CENTER</p>
          <h1 id="help-title">需要什么，直接搜</h1>
          <p class="hc-home-hero-copy">从第一次复盘训练到真实账单、策略回测和数据恢复。按你现在要完成的任务，一步一步操作。</p>
          <div class="hc-search-wrap">
            <label class="hc-search-field">
              ${icon("search")}
              <span class="hc-visually-hidden">搜索帮助文章</span>
              <input type="search" placeholder="搜索功能、问题或错误提示…" autocomplete="off" data-home-search>
              <kbd>/</kbd>
            </label>
            <div class="hc-search-results" data-home-results aria-live="polite"></div>
          </div>
          <div class="hc-popular-searches">
            <span>常用搜索</span>
            ${["第一次训练", "CFMMC", "止损", "资料库", "激活"]
              .map((term) => `<button type="button" data-search-term="${term}">${term}</button>`)
              .join("")}
          </div>
        </div>
      </section>

      <section class="hc-home-section" aria-labelledby="quick-task-title">
        <div class="hc-shell">
          <div class="hc-section-head">
            <div>
              <p class="hc-kicker">从一个任务开始</p>
              <h2 id="quick-task-title">三条最常用路径</h2>
            </div>
            <p>不用先读完整本说明书。选择你现在要完成的事情，做完后再沿着文章结尾进入下一步。</p>
          </div>
          <div class="hc-quick-routes">
            ${quickRoute("01", "开始第一次训练", "下载 EURUSD、建立存档、推进 K 线并完成第一笔模拟交易。", articlesById.get("qs-04"))}
            ${quickRoute("02", "导入一份真实账单", "从 MT4/MT5 或 CFMMC 导入历史成交，并匹配复盘行情。", articlesById.get("ac-02"))}
            ${quickRoute("03", "恢复或迁移我的数据", "移动完整资料库，或从自己的 S3 快照恢复。", articlesById.get("se-06"))}
          </div>
        </div>
      </section>

      <section class="hc-home-section" aria-labelledby="category-title">
        <div class="hc-shell">
          <div class="hc-section-head">
            <div>
              <p class="hc-kicker">教程分类</p>
              <h2 id="category-title">按功能查找教程</h2>
            </div>
            <p>教程按用户任务组织，同时覆盖功能说明、操作步骤和故障排查。选择分类即可查看已经发布的内容。</p>
          </div>
          <div class="hc-category-grid">
            ${publicCategories.map(categoryCard).join("")}
          </div>
        </div>
      </section>

      <section class="hc-home-section" aria-labelledby="featured-title">
        <div class="hc-shell">
          <div class="hc-section-head">
            <div>
              <p class="hc-kicker">推荐阅读</p>
              <h2 id="featured-title">详细教程</h2>
            </div>
            <p>每篇教程都围绕一个具体任务编写，按顺序操作即可完成对应设置或检查。</p>
          </div>
          <div class="hc-featured-list">
            ${featured.map(featuredArticle).join("")}
          </div>
          <div class="hc-version-note">
            <div>
              <strong>教程基线：TradeReplay v${escapeHTML(guide.version)}</strong>
              <p>适用于 TradeReplay macOS 与 Windows 桌面版。</p>
            </div>
            <a class="hc-button hc-button-secondary" href="changelog.html">
              查看更新日志
              ${icon("arrow")}
            </a>
          </div>
        </div>
      </section>`;

    const homeSearch = view.querySelector("[data-home-search]");
    const homeResults = view.querySelector("[data-home-results]");
    attachSearch(homeSearch, homeResults);
    view.querySelectorAll("[data-search-term]").forEach((button) => {
      button.addEventListener("click", () => {
        homeSearch.value = button.getAttribute("data-search-term");
        renderSearchResults(homeSearch.value, homeResults);
        homeSearch.focus();
      });
    });
  }

  function quickRoute(number, title, summary, article) {
    return `
      <a class="hc-quick-route" href="${articleHref(article)}">
        <div class="hc-quick-route-top">
          <span>PATH ${number}</span>
          ${icon("arrow")}
        </div>
        <h3>${escapeHTML(title)}</h3>
        <p>${escapeHTML(summary)}</p>
        <b>打开分步教程</b>
      </a>`;
  }

  function categoryCard(category) {
    return `
      <a class="hc-category-card" href="${categoryHref(category)}" data-tone="${category.tone}">
        ${categoryIcon(category)}
        <span class="hc-category-card-copy">
          <h3>${escapeHTML(category.title)}</h3>
          <p>${escapeHTML(category.description)}</p>
        </span>
        <span class="hc-category-card-foot">
          <span class="hc-category-card-count">${category.count} 篇</span>
          <span class="hc-category-card-arrow" aria-hidden="true">
            ${icon("arrow")}
          </span>
        </span>
      </a>`;
  }

  function featuredArticle(article) {
    return `
      <a class="hc-featured-article" href="${articleHref(article)}">
        <span class="hc-featured-code">${article.code}</span>
        <span>
          <h3>${escapeHTML(article.title)}</h3>
          <p>${escapeHTML(article.summary)}</p>
        </span>
        ${icon("arrow")}
      </a>`;
  }

  function renderCategory(category) {
    setDocumentMeta(category.title, category.description);
    const articles = publicArticles.filter((article) => article.category === category.id);
    view.innerHTML = `
      <div class="hc-page">
        <div class="hc-shell-wide">
          ${breadcrumbs([{ label: category.title }])}
          <div class="hc-category-layout">
            ${sideRail(category.id)}
            <section class="hc-category-main" aria-labelledby="category-page-title">
              <header class="hc-category-header">
                <div class="hc-category-header-top">
                  ${categoryIcon(category)}
                  <span class="hc-pill">${category.number} · ${articles.length} 篇教程</span>
                </div>
                <h1 id="category-page-title">${escapeHTML(category.title)}</h1>
                <p class="hc-category-lede">${escapeHTML(category.description)}</p>
              </header>
              <div class="hc-category-articles">
                <div class="hc-category-articles-head">
                  <h2>本分类文章</h2>
                  <span>${articles.length} 篇教程</span>
                </div>
                ${articles.map(articleRow).join("")}
              </div>
            </section>
          </div>
        </div>
      </div>`;
  }

  function articleRow(article) {
    const meta = `
      <span class="hc-article-row-code">${article.code}</span>
      <span>
        <h3>${escapeHTML(article.title)}</h3>
        <p>${escapeHTML(article.summary)}</p>
      </span>
      <span class="hc-article-row-meta">
        <span class="hc-pill hc-pill-ready">${escapeHTML(article.time)}</span>
        ${icon("arrow")}
      </span>`;
    return `<a class="hc-article-row" href="${articleHref(article)}">${meta}</a>`;
  }

  function renderArticle(article) {
    const category = getCategory(article);
    setDocumentMeta(article.title, article.summary);
    const related = (article.related || [])
      .map((id) => articlesById.get(id))
      .filter((item) => item?.status === "ready");
    const categoryArticles = publicArticles
      .filter((item) => item.category === article.category && item.id !== article.id)
      .slice(0, 5);
    const tocItems = articleToc(article);

    view.innerHTML = `
      <div class="hc-page">
        <div class="hc-shell-wide">
          ${breadcrumbs([
            { label: category.title, href: categoryHref(category) },
            { label: article.title }
          ])}
          <div class="hc-article-layout">
            ${sideRail(category.id)}
            <article class="hc-article" data-article>
              <header class="hc-article-head">
                <p class="hc-article-code">${article.code}</p>
                <h1>${escapeHTML(article.title)}</h1>
                <p class="hc-article-summary">${escapeHTML(article.summary)}</p>
                <div class="hc-article-meta">
                  <span class="hc-pill">${escapeHTML(article.level)}</span>
                  <span class="hc-pill ${article.tier === "Pro" ? "hc-pill-pro" : ""}">${escapeHTML(article.tier)}</span>
                  <span class="hc-pill">${escapeHTML(article.platform)}</span>
                  <span class="hc-pill">${escapeHTML(article.time)}</span>
                </div>
                <p class="hc-article-verified">
                  ${icon("check")}
                  <span>最后核对：TradeReplay v${escapeHTML(guide.version)} · ${escapeHTML(guide.verifiedDate)}</span>
                </p>
              </header>
              ${renderArticleBody(article, related)}
            </article>
            <aside class="hc-article-aside" aria-label="文章导航">
              ${
                tocItems.length
                  ? `<p class="hc-aside-title">本页内容</p>
                     <nav class="hc-toc" data-article-toc>
                       ${tocItems
                         .map((item) => `<a href="#${escapeHTML(item.id)}">${escapeHTML(item.title)}</a>`)
                         .join("")}
                     </nav>`
                  : ""
              }
              ${
                categoryArticles.length
                  ? `<div class="hc-aside-related">
                       <p class="hc-aside-title">本分类文章</p>
                       ${categoryArticles
                         .map((item) => `<a href="${articleHref(item)}">${escapeHTML(item.title)}</a>`)
                         .join("")}
                     </div>`
                  : ""
              }
            </aside>
          </div>
        </div>
      </div>`;

    attachArticleBehaviors();
  }

  function articleToc(article) {
    const result = [];
    if (article.before && article.before.length) result.push({ id: "before-you-start", title: "开始之前" });
    (article.sections || []).forEach((section) => result.push({ id: section.id, title: section.title }));
    if (article.success && article.success.length) result.push({ id: "success-state", title: "成功后你会看到" });
    if (article.faq && article.faq.length) result.push({ id: "common-questions", title: "常见问题" });
    return result;
  }

  function renderArticleBody(article, related) {
    return `
      <div class="hc-article-body">
        <p class="hc-article-outcome"><strong>完成后：</strong>${escapeHTML(article.outcome)}</p>
        ${
          article.before && article.before.length
            ? `<section class="hc-article-section" id="before-you-start">
                 <h2>开始之前</h2>
                 <ul class="hc-before-list">
                   ${article.before.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}
                 </ul>
               </section>`
            : ""
        }
        ${(article.sections || []).map(renderArticleSection).join("")}
        ${
          article.success && article.success.length
            ? `<section class="hc-article-section" id="success-state">
                 <h2>成功后你会看到</h2>
                 <ul class="hc-success-list">
                   ${article.success.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}
                 </ul>
               </section>`
            : ""
        }
        ${
          article.faq && article.faq.length
            ? `<section class="hc-article-section" id="common-questions">
                 <h2>常见问题</h2>
                 <div class="hc-faq-list">
                   ${article.faq
                     .map(
                       (item) => `
                         <details class="hc-faq">
                           <summary>${escapeHTML(item.q)}</summary>
                           <div class="hc-faq-answer hc-rich-text">${sanitizeRichHTML(item.a)}</div>
                         </details>`
                     )
                     .join("")}
                 </div>
               </section>`
            : ""
        }
        <div class="hc-article-end">
          <div class="hc-article-end-head">
            <h2>下一步</h2>
            <span>沿着当前任务继续</span>
          </div>
          <div class="hc-related-grid">
            ${related.map(relatedCard).join("")}
          </div>
          <div class="hc-feedback" data-feedback>
            <p>这篇文章解决了你的问题吗？</p>
            <div class="hc-feedback-actions">
              <button type="button" data-feedback-value="yes">解决了</button>
              <button type="button" data-feedback-value="no">还没有</button>
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderArticleSection(section) {
    return `
      <section class="hc-article-section" id="${escapeHTML(section.id)}">
        <h2>${escapeHTML(section.title)}</h2>
        ${
          section.body
            ? `<div class="hc-rich-text">${sanitizeRichHTML(section.body)}</div>`
            : (section.paragraphs || []).map((item) => `<p>${escapeHTML(item)}</p>`).join("")
        }
        ${
          section.steps
            ? `<ol class="hc-step-list">
                 ${section.steps
                   .map(
                     (step) => `
                       <li>
                         <strong>${escapeHTML(step.title)}</strong>
                         <div class="hc-step-body hc-rich-text">${sanitizeRichHTML(step.body)}</div>
                       </li>`
                   )
                   .join("")}
               </ol>`
            : ""
        }
        ${
          section.bullets
            ? `<ul class="hc-bullet-list">${section.bullets
                .map((item) => `<li>${escapeHTML(item)}</li>`)
                .join("")}</ul>`
            : ""
        }
        ${section.callout ? renderCallout(section.callout) : ""}
        ${section.media ? renderMedia(section.media) : ""}
      </section>`;
  }

  function renderCallout(callout) {
    const iconName =
      callout.tone === "warning" ? "warning" :
      callout.tone === "security" ? "security" :
      callout.tone === "tip" ? "check" : "info";
    return `
      <aside class="hc-callout" data-tone="${escapeHTML(callout.tone || "note")}">
        <span class="hc-callout-icon">${icon(iconName)}</span>
        <span>
          <strong>${escapeHTML(callout.title)}</strong>
          <div class="hc-callout-body hc-rich-text">${sanitizeRichHTML(callout.body)}</div>
        </span>
      </aside>`;
  }

  function renderMedia(media) {
    const isVideo = media.type === "video";
    if (!media.ready) return "";
    return `
      <figure class="hc-media-frame" data-type="${isVideo ? "video" : "image"}">
        ${
          isVideo
            ? `<video controls preload="metadata" playsinline controlslist="nodownload" disablepictureinpicture${
                media.poster ? ` poster="${escapeHTML(media.poster)}"` : ""
              }>
                 <source src="${escapeHTML(media.file)}" type="video/mp4">
                 你的浏览器暂时无法播放这个视频。
               </video>`
            : `<img src="${escapeHTML(media.file)}" alt="${escapeHTML(media.alt || media.label)}" loading="lazy" decoding="async">`
        }
        <figcaption>${escapeHTML(media.label)}</figcaption>
      </figure>`;
  }

  function relatedCard(article) {
    const category = getCategory(article);
    return `
      <a class="hc-related-card" href="${articleHref(article)}">
        <span>${article.code} · ${escapeHTML(category.short)}</span>
        <h3>${escapeHTML(article.title)}</h3>
        <p>${escapeHTML(article.summary)}</p>
      </a>`;
  }

  function renderNotFound() {
    setDocumentMeta("没有找到这篇教程", "返回 TradeReplay 帮助中心继续查找。");
    view.innerHTML = `
      <div class="hc-page">
        <div class="hc-shell">
          ${breadcrumbs([{ label: "未找到" }])}
          <div class="hc-outline-state">
            ${icon("search")}
            <h1>没有找到这篇教程</h1>
            <p>链接可能已经调整，或者内容暂未公开。请返回帮助中心搜索功能名称或错误提示。</p>
            <a class="hc-button" href="guide.html">返回帮助中心</a>
          </div>
        </div>
      </div>`;
  }

  function attachArticleBehaviors() {
    const feedback = view.querySelector("[data-feedback]");
    if (feedback) {
      feedback.querySelectorAll("[data-feedback-value]").forEach((button) => {
        button.addEventListener("click", () => {
          const solved = button.getAttribute("data-feedback-value") === "yes";
          feedback.classList.add("is-complete");
          feedback.innerHTML = solved
            ? "谢谢反馈，我们会继续保持文章准确。"
            : '谢谢反馈。你可以前往<a href="support.html">支持页面</a>告诉我们卡在哪一步。';
        });
      });
    }

    const toc = view.querySelector("[data-article-toc]");
    const sections = Array.from(view.querySelectorAll(".hc-article-section[id]"));
    if (toc && sections.length && "IntersectionObserver" in window) {
      const links = new Map(
        Array.from(toc.querySelectorAll("a")).map((link) => [
          link.getAttribute("href").slice(1),
          link
        ])
      );
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          if (!visible) return;
          links.forEach((link) => link.classList.remove("is-active"));
          links.get(visible.target.id)?.classList.add("is-active");
        },
        { rootMargin: "-18% 0px -68% 0px", threshold: [0, 0.1] }
      );
      sections.forEach((section) => observer.observe(section));
    }
  }

  function route() {
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get("article");
    const categoryId = params.get("category");
    if (articleId) {
      const article = articlesById.get(articleId);
      if (article) renderArticle(article);
      else renderNotFound();
    } else if (categoryId) {
      const category = categoriesById.get(categoryId);
      if (category) renderCategory(category);
      else renderNotFound();
    } else {
      renderHome();
    }
    if (loading) loading.remove();
    window.scrollTo(0, 0);
  }

  function openSearch() {
    if (!searchDialog || !searchDialog.showModal) return;
    searchDialog.showModal();
    window.setTimeout(() => modalSearch?.focus(), 30);
  }

  document.querySelectorAll("[data-open-search]").forEach((button) => {
    button.addEventListener("click", openSearch);
  });

  attachSearch(modalSearch, modalResults);

  if (searchDialog) {
    searchDialog.addEventListener("close", () => {
      if (modalSearch) modalSearch.value = "";
      if (modalResults) modalResults.innerHTML = "";
    });
    searchDialog.addEventListener("click", (event) => {
      const rect = searchDialog.getBoundingClientRect();
      const outside =
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom;
      if (outside) searchDialog.close();
    });
  }

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const isTyping =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target?.isContentEditable;
    if (event.key === "/" && !isTyping) {
      event.preventDefault();
      openSearch();
    }
  });

  if (menuButton && menu) {
    menuButton.addEventListener("click", () => {
      const open = menu.getAttribute("data-open") === "true";
      menu.setAttribute("data-open", String(!open));
      menuButton.setAttribute("aria-expanded", String(!open));
    });
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.setAttribute("data-open", "false");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  function updateReadingProgress() {
    if (!progress) return;
    const article = document.querySelector("[data-article]");
    if (!article) {
      document.documentElement.style.setProperty("--hc-reading-progress", "0");
      return;
    }
    const rect = article.getBoundingClientRect();
    const start = window.scrollY + rect.top - 120;
    const length = Math.max(article.offsetHeight - window.innerHeight * 0.65, 1);
    const value = Math.min(Math.max((window.scrollY - start) / length, 0), 1);
    document.documentElement.style.setProperty("--hc-reading-progress", value.toFixed(4));
  }

  window.addEventListener("scroll", updateReadingProgress, { passive: true });
  window.addEventListener("resize", updateReadingProgress);

  route();
  updateReadingProgress();
})();
