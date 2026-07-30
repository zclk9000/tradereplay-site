(() => {
  const root = document.documentElement;
  const storageKey = "tradereplay-theme";
  const lightThemeColor = "#f6f8fc";
  const darkThemeColor = "#070b13";

  function readStoredTheme() {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved === "light" || saved === "dark" ? saved : null;
    } catch {
      return null;
    }
  }

  function readQueryTheme() {
    const queryTheme = new URLSearchParams(window.location.search).get("theme");
    return queryTheme === "light" || queryTheme === "dark" ? queryTheme : null;
  }

  function updateThemeColor(theme) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.content = theme === "light" ? lightThemeColor : darkThemeColor;
    }
  }

  function updateFavicon(theme) {
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.href = theme === "light" ? "assets/brand/logo.svg" : "assets/brand/logo-dark.svg";
    }
  }

  function updateLogos(theme) {
    document.querySelectorAll('img[src$="logo.svg"], img[src$="logo-dark.svg"]').forEach((logo) => {
      logo.src = theme === "light" ? "assets/brand/logo.svg" : "assets/brand/logo-dark.svg";
    });
  }

  function updateToggle(toggle, theme) {
    const nextTheme = theme === "light" ? "dark" : "light";
    toggle.setAttribute("aria-label", nextTheme === "light" ? "切换到浅色主题" : "切换到深色主题");
    toggle.setAttribute("title", nextTheme === "light" ? "切换到浅色主题" : "切换到深色主题");
    toggle.setAttribute("aria-pressed", String(theme === "dark"));
  }

  function applyTheme(theme, options = {}) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    updateThemeColor(theme);
    updateFavicon(theme);

    if (document.readyState !== "loading") {
      updateLogos(theme);
      document.querySelectorAll("[data-theme-toggle]").forEach((toggle) => {
        updateToggle(toggle, theme);
      });
    }

    if (options.persist) {
      try {
        localStorage.setItem(storageKey, theme);
      } catch {
        // The selected theme still applies for the current page.
      }
    }
  }

  const initialTheme = readQueryTheme() || readStoredTheme() || "light";
  applyTheme(initialTheme);

  function createThemeToggle() {
    const toggle = document.createElement("button");
    toggle.className = "theme-toggle";
    toggle.type = "button";
    toggle.dataset.themeToggle = "";
    toggle.innerHTML = `
      <svg class="theme-toggle-icon theme-toggle-moon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.2 15.2A8.1 8.1 0 0 1 8.8 3.8 8.4 8.4 0 1 0 20.2 15.2Z"></path>
      </svg>
      <svg class="theme-toggle-icon theme-toggle-sun" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3.5"></circle>
        <path d="M12 2.2v2.1M12 19.7v2.1M4.3 12H2.2M21.8 12h-2.1M5.1 5.1l1.5 1.5M17.4 17.4l1.5 1.5M18.9 5.1l-1.5 1.5M6.6 17.4l-1.5 1.5"></path>
      </svg>
      <span class="theme-toggle-label">切换明暗主题</span>
    `;
    updateToggle(toggle, root.dataset.theme);
    toggle.addEventListener("click", () => {
      applyTheme(root.dataset.theme === "light" ? "dark" : "light", { persist: true });
    });
    return toggle;
  }

  function mountThemeToggle() {
    if (document.querySelector("[data-theme-toggle]")) {
      return;
    }

    const toggle = createThemeToggle();
    const homeActions = document.querySelector(".header-actions");
    const guideActions = document.querySelector(".hc-header-actions");
    const legalNav = document.querySelector(".legal-nav");
    const changelogLanguage = document.querySelector(".changelog-language-toggle");
    const homeHeader = document.querySelector(".header-inner");

    if (guideActions) {
      guideActions.prepend(toggle);
    } else if (homeActions) {
      homeActions.prepend(toggle);
    } else if (legalNav) {
      legalNav.append(toggle);
    } else if (changelogLanguage) {
      changelogLanguage.before(toggle);
    } else if (homeHeader) {
      homeHeader.append(toggle);
    } else {
      return;
    }

    updateLogos(root.dataset.theme);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountThemeToggle, { once: true });
  } else {
    mountThemeToggle();
  }
})();
