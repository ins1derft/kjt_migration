import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = 'https://kidsjumptech.com/wp-json/wp/v2';
const SITE = 'https://kidsjumptech.com';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchTextWithTimeout(url, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    return await res.text();
  } catch (err) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function decodeHtml(input) {
  if (!input) return input;
  return input
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function extractYoutubeId(html) {
  if (!html) return null;
  const patterns = [
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/i,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/i,
    /youtu\.be\/([a-zA-Z0-9_-]{6,})/i,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{6,})/i,
  ];
  for (const re of patterns) {
    const match = html.match(re);
    if (match) return match[1];
  }
  return null;
}

async function fetchJson(url, { timeoutMs = 20000, retries = 2 } = {}) {
  let lastError = null;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        headers: { accept: 'application/json' },
        signal: controller.signal,
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Request failed ${res.status} ${res.statusText} for ${url}: ${text.slice(0, 200)}`);
      }
      return { data: await res.json(), headers: res.headers };
    } catch (err) {
      lastError = err;
      await sleep(300 + attempt * 300);
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError;
}

async function fetchAll(endpoint, params = {}, options = {}) {
  const url = new URL(`${BASE}/${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    url.searchParams.set(key, String(value));
  });

  const first = await fetchJson(url.toString(), options);
  const totalPages = Number(first.headers.get('x-wp-totalpages') || '1');
  const items = [...first.data];

  for (let page = 2; page <= totalPages; page += 1) {
    url.searchParams.set('page', String(page));
    const next = await fetchJson(url.toString(), options);
    items.push(...next.data);
    await sleep(150);
  }

  return items;
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const current = index;
      index += 1;
      results[current] = await fn(items[current], current);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function run() {
  const [categories, gameTypes, gameAges, productsUsed] = await Promise.all([
    fetchAll('game-category', { per_page: 100, page: 1 }, { timeoutMs: 20000, retries: 2 }),
    fetchAll('game-type', { per_page: 100, page: 1 }, { timeoutMs: 20000, retries: 2 }),
    fetchAll('game-age', { per_page: 100, page: 1 }, { timeoutMs: 20000, retries: 2 }),
    fetchAll('products-used', { per_page: 100, page: 1 }, { timeoutMs: 20000, retries: 2 }),
  ]);

  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const gameTypeById = new Map(gameTypes.map((t) => [t.id, t]));
  const gameAgeById = new Map(gameAges.map((t) => [t.id, t]));
  const productById = new Map(productsUsed.map((p) => [p.id, p]));

  const games = await fetchAll(
    'games',
    {
      per_page: 50,
      page: 1,
      _fields: 'id,slug,title,excerpt,content,featured_media,game-category,game-type,game-age,products-used,yoast_head_json',
    },
    { timeoutMs: 30000, retries: 3 }
  );

  const mediaIds = Array.from(new Set(games.map((g) => g.featured_media).filter((id) => Number(id) > 0)));
  const mediaMap = new Map();
  for (let i = 0; i < mediaIds.length; i += 100) {
    const chunk = mediaIds.slice(i, i + 100);
    const mediaItems = await fetchAll(
      'media',
      {
        include: chunk.join(','),
        per_page: 100,
        page: 1,
        _fields: 'id,source_url,alt_text',
      },
      { timeoutMs: 20000, retries: 2 }
    );
    mediaItems.forEach((m) => mediaMap.set(m.id, m));
    await sleep(150);
  }

  let processed = 0;
  const mappedGames = await mapLimit(games, 16, async (item) => {
    const categoryTerms = (item['game-category'] || []).map((id) => categoryById.get(id)).filter(Boolean);
    const gameTypeTerms = (item['game-type'] || []).map((id) => gameTypeById.get(id)).filter(Boolean);
    const ageTerms = (item['game-age'] || []).map((id) => gameAgeById.get(id)).filter(Boolean);
    const productTerms = (item['products-used'] || []).map((id) => productById.get(id)).filter(Boolean);

    const media = mediaMap.get(item.featured_media);
    const heroImage = media?.source_url ?? null;
    const heroAlt = media?.alt_text ?? null;

    const slug = item.slug;
    const html = await fetchTextWithTimeout(`${SITE}/games/${slug}/`);
    const videoId = extractYoutubeId(html);

    const seo = item.yoast_head_json || {};
    const ogImage = Array.isArray(seo.og_image) && seo.og_image.length
      ? seo.og_image[0]?.url
      : null;

    const mapped = {
      slug,
      title: decodeHtml(item.title?.rendered ?? ''),
      excerpt_html: item.excerpt?.rendered ?? null,
      body_html: item.content?.rendered ?? null,
      hero_image: heroImage,
      hero_image_alt: heroAlt,
      genre: categoryTerms[0]?.name ?? null,
      game_type: gameTypeTerms[0]?.name ?? null,
      target_age: ageTerms.map((t) => t.name).join(', ') || null,
      video_id: videoId,
      video_url: videoId ? `https://www.youtube.com/watch?v=${videoId}` : null,
      categories: categoryTerms.map((t) => ({ slug: t.slug, name: t.name })),
      products_used: productTerms.map((t) => ({ slug: t.slug, name: t.name })),
      seo: {
        title: seo.title || null,
        description: seo.description || null,
        canonical: seo.canonical || null,
        og_image: ogImage || null,
      },
    };

    processed += 1;
    if (processed % 25 === 0) {
      console.log(`Processed ${processed}/${games.length}...`);
    }

    return mapped;
  });

  const payload = {
    source: SITE,
    exported_at: new Date().toISOString(),
    categories: categories.map((c) => ({ slug: c.slug, name: c.name, description: c.description || null })),
    game_types: gameTypes.map((t) => ({ slug: t.slug, name: t.name })),
    game_ages: gameAges.map((t) => ({ slug: t.slug, name: t.name })),
    products_used: productsUsed.map((t) => ({ slug: t.slug, name: t.name })),
    games: mappedGames,
  };

  const outputPath = path.resolve('backend/scripts/legacy-games.json');
  await fs.writeFile(outputPath, JSON.stringify(payload, null, 2));
  console.log(`Saved ${mappedGames.length} games to ${outputPath}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
