const SITE_VISITS_PATH = "/api/site-visits";
const GOATCOUNTER_TOTAL_URL = "https://tradereplay.goatcounter.com/counter/TOTAL.json";

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Cache-Control": status === 200 ? "public, max-age=60, s-maxage=300" : "no-store",
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== SITE_VISITS_PATH) {
      return env.ASSETS.fetch(request);
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response(null, {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }

    try {
      const upstream = await fetch(GOATCOUNTER_TOTAL_URL, {
        headers: { Accept: "application/json" },
        cf: {
          cacheEverything: true,
          cacheTtl: 300,
        },
      });

      if (upstream.status === 404) {
        return jsonResponse({ count: "0" });
      }

      if (!upstream.ok) {
        throw new Error(`GoatCounter returned ${upstream.status}`);
      }

      const result = await upstream.json();
      const count = typeof result?.count === "string" ? result.count.trim() : "";
      return jsonResponse({ count: count || "0" });
    } catch {
      return jsonResponse({ count: null }, 503);
    }
  },
};
