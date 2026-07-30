(() => {
  const productionHosts = new Set(["tradereplay.dev", "www.tradereplay.dev"]);
  const goatCounterBase = "https://tradereplay.goatcounter.com";
  const counterStatus = document.querySelector("[data-site-visit-status]");
  const counterValue = document.querySelector("[data-site-visit-count]");

  function finishCounter(state, value = "—") {
    if (!counterStatus || !counterValue) return;
    counterValue.textContent = value;
    counterStatus.dataset.state = state;
    counterStatus.setAttribute("aria-busy", "false");
  }

  if (!productionHosts.has(window.location.hostname)) {
    finishCounter("preview");
    return;
  }

  const tracker = document.createElement("script");
  tracker.async = true;
  tracker.src = "https://gc.zgo.at/count.js";
  tracker.dataset.goatcounter = `${goatCounterBase}/count`;
  tracker.referrerPolicy = "strict-origin-when-cross-origin";
  tracker.addEventListener("error", () => finishCounter("unavailable"), { once: true });
  document.head.append(tracker);

  if (!counterValue) return;

  fetch("/api/site-visits", {
    cache: "no-store",
  })
    .then((response) => {
      if (response.status === 404) return { count: "0" };
      if (!response.ok) throw new Error(`Counter request failed: ${response.status}`);
      return response.json();
    })
    .then((result) => {
      const count = typeof result?.count === "string" ? result.count.trim() : "";
      finishCounter(count ? "ready" : "unavailable", count || "—");
    })
    .catch(() => finishCounter("unavailable"));
})();
