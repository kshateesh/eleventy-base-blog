// dynamic-edge-handler-kv.js
// Cloudflare Edge Function for cache‑priming tests
//   ↳ Bind a KV namespace called  STATS  in wrangler.toml
//
//   • GET /<slug>              → unique payload + KV‑based hit tracking
//   • GET /stats[?window=ms]   → JSON metrics for the last <window> ms (default 5 min)

const DEFAULT_WIN = 5 * 60 * 1000;  // 5 minutes

export default async function handler(req, context) {
  const { STATS } = context.env;            // KV binding
  const now       = Date.now();
  const url       = new URL(req.url);
  const slug      = url.pathname.replace(/^\/+/, "");          // strip leading '/'
  const windowMs  = parseInt(url.searchParams.get("window") || DEFAULT_WIN, 10);

  // ────────────────────────────────────────────────────────────
  // 1️⃣  /stats  — aggregate metrics from KV
  // ────────────────────────────────────────────────────────────
  if (slug === "stats" || slug === "") {
    // List at most 1000 keys (enough for our 200‑route test)
    const { keys } = await STATS.list({ limit: 1000 });
    let totalHits  = 0;
    const routes   = {};

    for (const { name } of keys) {
      const data = await STATS.get(name, { type: "json" });   // { hits, last }
      if (!data) continue;

      if (now - data.last <= windowMs) {
        totalHits           += data.hits;
        routes[name]          = data;
      } else {
        // Optionally prune stale entries
        await STATS.delete(name);
      }
    }

    return new Response(JSON.stringify({
      windowMs,
      totalCalls : totalHits,
      routesCount: Object.keys(routes).length,
      routes,
      generatedAt: new Date().toISOString(),
    }, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  }

  // ────────────────────────────────────────────────────────────
  // 2️⃣  /<slug>  — dynamic content + KV tracking
  // ────────────────────────────────────────────────────────────
  if (slug) {
    // Get existing record or initialise
    const record   = await STATS.get(slug, { type: "json" }) || { hits: 0, last: now };
    record.hits   += 1;
    record.last    = now;

    // Store back (no expiration; stale data is ignored in /stats)
    await STATS.put(slug, JSON.stringify(record));

    return new Response(
      `🍰 Fresh content for "${slug}" @ ${new Date().toISOString()}\n`,
      { headers: { "Content-Type": "text/plain" } },
    );
  }

  // ────────────────────────────────────────────────────────────
  // 3️⃣  Fallback / help
  // ────────────────────────────────────────────────────────────
  return new Response(
    `Usage:
  • /alpha, /beta …           → dynamic payload (tracks hits in KV)
  • /stats[?window=60000]     → metrics JSON (default window 5 min)

  Bind a KV namespace called STATS in wrangler.toml:
    [[kv_namespaces]]
    binding = "STATS"
    id      = "<namespace_id>"`,
    { status: 404, headers: { "Content-Type": "text/plain" } },
  );
}
