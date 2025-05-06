const DEFAULT_WIN = 5 * 60 * 1000;  // 5 minutes

export default async function handler(req, context) {
  context.env.STATS = context.env.STATS || {};  // Initialize STATS in context.env if not already present
  const { STATS } = context.env;               // Destructure STATS from context.env
  const now       = Date.now();
  const url       = new URL(req.url);
  const slug      = url.pathname.replace(/^\/+/, "");          // strip leading '/'
  const windowMs  = parseInt(url.searchParams.get("window") || DEFAULT_WIN, 10);

  if (slug === "stats" || slug === "") {
    // List at most 1000 keys (enough for our 200‑route test)
    const keys = await STATS.keys({ limit: 1000 });
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
      windowMs: windowMs,
      totalCalls : totalHits,
      routesCount: Object.keys(routes).length,
      routes: routes,
      generatedAt: new Date().toISOString(),
    }, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  }

  
  if (slug) {
    // Get existing record or initialise
    const record   = await STATS.get(slug, { type: "json" }) || { hits: 0, last: now };
    record.hits   += 1;
    record.last    = now;

    // Store back (no expiration; stale data is ignored in /stats)
    await STATS.put(slug, JSON.stringify(record));

    return new Response(
      `-------> Fresh content for "${slug}" @ ${new Date().toISOString()}\n`,
      { headers: { "Content-Type": "text/plain" } },
    );
  }

  return new Response(
    "error response",
    { status: 404, headers: { "Content-Type": "text/plain" } },
  );
}
