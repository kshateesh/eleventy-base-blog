// dynamic-edge-handler.js
// Cloudflare Edge Function for cache‑priming tests
//   ‣ GET /<slug>       → unique payload + hit‑tracking
//   ‣ GET /stats[?window=ms] → JSON metrics for the last <window> ms (default = 5 min)

const routeStats  = new Map();           // Map<slug, { hits, last }>
const DEFAULT_WIN = 5 * 60 * 1000;       // 5 minutes

export default async function handler(req, context) {
  const now  = Date.now();
  const url  = new URL(req.url);
  const slug = url.pathname.replace(/^\/+/, "");                // strip leading "/"
  const win  = parseInt(url.searchParams.get("window") || DEFAULT_WIN, 10);

  // 1️⃣  /stats  — return call‑metrics
  if (slug === "stats" || slug === "") {
    // prune stale entries
    for (const [key, info] of routeStats) {
      if (now - info.last > win) routeStats.delete(key);
    }

    const total = [...routeStats.values()]
      .reduce((sum, { hits }) => sum + hits, 0);

    return new Response(JSON.stringify({
      windowMs   : win,
      totalCalls : total,
      routesCount: routeStats.size,
      routes     : Object.fromEntries(routeStats),
      generatedAt: new Date().toISOString(),
    }, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // 2️⃣  /<slug>  — dynamic content + tracking
  if (slug) {
    const record = routeStats.get(slug) || { hits: 0, last: now };
    record.hits += 1;
    record.last  = now;
    routeStats.set(slug, record);

    return new Response(
      `🍰 Fresh content for "${slug}" @ ${new Date().toISOString()}\n`,
      { headers: { "Content-Type": "text/plain" } },
    );
  }

  // 3️⃣  Fallback / help for unknown paths
  return new Response(
    `Usage:
  • /alpha, /beta …           → dynamic payload (tracks hits)
  • /stats[?window=60000]     → metrics JSON (default window 5 min)`,
    { status: 404, headers: { "Content-Type": "text/plain" } },
  );
}
