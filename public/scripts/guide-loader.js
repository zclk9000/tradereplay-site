(function () {
  "use strict";

  async function fetchJSON(path) {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`无法读取 ${path}（HTTP ${response.status}）`);
    }
    return response.json();
  }

  window.TRADE_REPLAY_GUIDE_READY = (async function loadGuideContent() {
    const guide = await fetchJSON("data/guide-content.json");
    window.TRADE_REPLAY_GUIDE = guide;
    return guide;
  })();
})();
