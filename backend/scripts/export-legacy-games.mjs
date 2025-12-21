import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const BASE = 'https://kidsjumptech.com/wp-json/wp/v2';
const SITE = 'https://kidsjumptech.com';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const execFileAsync = promisify(execFile);

const argv = process.argv.slice(2);
const getArgValue = (name) => {
  const prefix = `--${name}=`;
  const raw = argv.find((arg) => arg.startsWith(prefix));
  return raw ? raw.slice(prefix.length) : null;
};
const hasFlag = (name) => argv.includes(`--${name}`);

const onlySlug = getArgValue('slug');
const outputOverride = getArgValue('output');
const writeStdout = hasFlag('stdout');
const skipMedia = hasFlag('skip-media');

const MEDIA_ROOT = path.resolve('backend/storage/app/public');

function getUrlExtension(url) {
  try {
    const pathname = new URL(url).pathname;
    const ext = path.extname(pathname).slice(1).toLowerCase();
    return ext || null;
  } catch {
    const ext = path.extname(String(url)).slice(1).toLowerCase();
    return ext || null;
  }
}

async function downloadMediaFile(url, relativePath, { timeoutSeconds = 60 } = {}) {
  const absolutePath = path.join(MEDIA_ROOT, relativePath);
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });

  try {
    await fs.access(absolutePath);
    return relativePath;
  } catch {
    // continue
  }

  await execFileAsync(
    'curl',
    [
      '-sL',
      '--fail',
      '--retry',
      '3',
      '--retry-delay',
      '1',
      '--retry-all-errors',
      '--max-time',
      String(timeoutSeconds),
      '-o',
      absolutePath,
      url,
    ],
    { maxBuffer: 5 * 1024 * 1024 }
  );

  return relativePath;
}

async function fetchTextWithTimeout(url, { timeoutMs = 25000, retries = 1 } = {}) {
  const maxTimeSeconds = Math.max(1, Math.ceil(timeoutMs / 1000));

  let lastError = null;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const { stdout } = await execFileAsync(
        'curl',
        [
          '-sL',
          '--retry',
          '3',
          '--retry-delay',
          '1',
          '--retry-all-errors',
          '--max-time',
          String(maxTimeSeconds),
          '-b',
          'nitroCachedPage=0',
          '-H',
          'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          url,
        ],
        { maxBuffer: 20 * 1024 * 1024 }
      );
      if (!stdout) return null;
      return stdout;
    } catch (err) {
      lastError = err;
      await sleep(400 + attempt * 400);
    }
  }

  void lastError;
  return null;
}

function decodeHtml(input) {
  if (!input) return input;
  return input
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '…')
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
    /youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]{6,})/i,
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

function stripHtml(input) {
  if (!input) return '';
  return String(input)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function makeExcerptHtml(bodyHtml, maxChars = 180) {
  const text = decodeHtml(stripHtml(bodyHtml));
  if (!text) return null;
  if (text.length <= maxChars) return `<p>${text}</p>`;
  const slice = text.slice(0, maxChars);
  const lastSpaceIdx = slice.lastIndexOf(' ');
  const candidate = lastSpaceIdx > 80 ? slice.slice(0, lastSpaceIdx) : slice;
  const trimmed = candidate.trim().replace(/[.,;:!?]+$/g, '');
  return `<p>${trimmed}…</p>`;
}

function parseGridConfig(html) {
  if (!html) return null;
  const match = html.match(/<div class="w-grid-json hidden"[^>]*onclick='return ([^']+)'/i);
  if (!match) return null;

  const decoded = decodeHtml(match[1]);
  try {
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function parseGamesGridEntries(html) {
  if (!html) return [];

  const entries = [];
  const articleRe = /<article\b[^>]*class="[^"]*\bw-grid-item\b[^"]*"[^>]*>[\s\S]*?<\/article>/gi;
  let match;
  while ((match = articleRe.exec(html))) {
    const articleHtml = match[0];
    const hrefMatch = articleHtml.match(/href="https?:\/\/kidsjumptech\.com\/games\/([^\/"]+)\/"/i);
    if (!hrefMatch) continue;
    const slug = hrefMatch[1];

    const imgSrcMatch = articleHtml.match(/<img[^>]*\ssrc="([^"]+)"/i);
    const imageUrl = imgSrcMatch ? imgSrcMatch[1] : null;

    const imgAltMatch = articleHtml.match(/<img[^>]*\salt="([^"]*)"/i);
    const imageAlt = imgAltMatch ? decodeHtml(imgAltMatch[1]) : null;

    const excerptMatch = articleHtml.match(/<div class="w-post-elm post_content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    const excerptText = excerptMatch ? decodeHtml(stripHtml(excerptMatch[1])) : null;
    const excerptHtml = excerptText ? `<p>${excerptText}</p>` : null;

    const videoId = extractYoutubeId(articleHtml);

    entries.push({ slug, imageUrl, imageAlt, excerptHtml, videoId });
  }

  return entries;
}

async function postFormWithTimeout(url, formBody, { timeoutMs = 25000, retries = 1 } = {}) {
  const maxTimeSeconds = Math.max(1, Math.ceil(timeoutMs / 1000));

  let lastError = null;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const { stdout } = await execFileAsync(
        'curl',
        [
          '-sL',
          '--retry',
          '3',
          '--retry-delay',
          '1',
          '--retry-all-errors',
          '--max-time',
          String(maxTimeSeconds),
          '-b',
          'nitroCachedPage=0',
          '-H',
          'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          '-H',
          'X-Requested-With: XMLHttpRequest',
          '-H',
          'Content-Type: application/x-www-form-urlencoded; charset=UTF-8',
          '--data-raw',
          formBody,
          url,
        ],
        { maxBuffer: 20 * 1024 * 1024 }
      );
      if (!stdout) return null;
      return stdout;
    } catch (err) {
      lastError = err;
      await sleep(400 + attempt * 400);
    }
  }

  void lastError;
  return null;
}

async function scrapeGamesGrid({ slug: targetSlug } = {}) {
  const gridHtml = await fetchTextWithTimeout(`${SITE}/games/`, { timeoutMs: 25000, retries: 2 });
  if (!gridHtml) {
    throw new Error('Failed to fetch legacy games grid HTML.');
  }

  const config = parseGridConfig(gridHtml);
  const maxPages = Number(config?.max_num_pages ?? 1) || 1;

  const entriesBySlug = new Map();
  for (const entry of parseGamesGridEntries(gridHtml)) {
    entriesBySlug.set(entry.slug, entry);
  }

  if (targetSlug && entriesBySlug.has(targetSlug)) {
    return entriesBySlug;
  }

  if (!config?.template_vars) {
    return entriesBySlug;
  }

  for (let page = 2; page <= maxPages; page += 1) {
    const templateVars = structuredClone(config.template_vars);
    templateVars.query_args = templateVars.query_args || {};
    templateVars.query_args.paged = page;

    const body = new URLSearchParams({
      action: String(config.action ?? 'us_ajax_grid'),
      infinite_scroll: String(config.infinite_scroll ?? 0),
      max_num_pages: String(config.max_num_pages ?? maxPages),
      pagination: String(config.pagination ?? 'ajax'),
      template_vars: JSON.stringify(templateVars),
    }).toString();

    const pageHtml = await postFormWithTimeout(`${SITE}/wp-admin/admin-ajax.php`, body, {
      timeoutMs: 25000,
      retries: 2,
    });

    if (!pageHtml) {
      throw new Error(`Failed to fetch legacy games grid page ${page}/${maxPages}.`);
    }

    for (const entry of parseGamesGridEntries(pageHtml)) {
      entriesBySlug.set(entry.slug, entry);
    }

    if (targetSlug && entriesBySlug.has(targetSlug)) {
      break;
    }
  }

  return entriesBySlug;
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
  const [gridEntriesBySlug, categories, gameTypes, gameAges, productsUsed] = await Promise.all([
    scrapeGamesGrid({ slug: onlySlug }),
    fetchAll('game-category', { per_page: 100, page: 1 }, { timeoutMs: 20000, retries: 2 }),
    fetchAll('game-type', { per_page: 100, page: 1 }, { timeoutMs: 20000, retries: 2 }),
    fetchAll('game-age', { per_page: 100, page: 1 }, { timeoutMs: 20000, retries: 2 }),
    fetchAll('products-used', { per_page: 100, page: 1 }, { timeoutMs: 20000, retries: 2 }),
  ]);

  const categoryById = new Map(categories.map((c) => [c.id, c]));
  const gameTypeById = new Map(gameTypes.map((t) => [t.id, t]));
  const gameAgeById = new Map(gameAges.map((t) => [t.id, t]));
  const productById = new Map(productsUsed.map((p) => [p.id, p]));

  const gamesParams = {
    per_page: onlySlug ? 1 : 50,
    page: 1,
    _fields: 'id,slug,title,excerpt,content,featured_media,game-category,game-type,game-age,products-used,yoast_head_json',
  };
  if (onlySlug) {
    gamesParams.slug = onlySlug;
  }

  const games = await fetchAll('games', gamesParams, { timeoutMs: 30000, retries: 3 });

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
  const mappedGames = await mapLimit(games, onlySlug ? 1 : 6, async (item) => {
    const categoryTerms = (item['game-category'] || []).map((id) => categoryById.get(id)).filter(Boolean);
    const gameTypeTerms = (item['game-type'] || []).map((id) => gameTypeById.get(id)).filter(Boolean);
    const ageTerms = (item['game-age'] || []).map((id) => gameAgeById.get(id)).filter(Boolean);
    const productTerms = (item['products-used'] || []).map((id) => productById.get(id)).filter(Boolean);

    const media = mediaMap.get(item.featured_media);
    const heroImage = media?.source_url ?? null;
    const heroAlt = media?.alt_text ?? null;

    const slug = item.slug;
    const gridEntry = gridEntriesBySlug.get(slug) || null;
    const videoId = gridEntry?.videoId ?? null;

    const seo = item.yoast_head_json || {};
    const ogImage = Array.isArray(seo.og_image) && seo.og_image.length
      ? seo.og_image[0]?.url
      : null;

    const excerptFromWp = (item.excerpt?.rendered ?? '').trim();
    const excerptFromGrid = (gridEntry?.excerptHtml ?? '').trim();
    const excerptFromContent = makeExcerptHtml(item.content?.rendered ?? null);
    const seoDescription = typeof seo.description === 'string' ? seo.description.trim() : '';
    const excerptFromSeo = seoDescription ? `<p>${decodeHtml(seoDescription)}</p>` : null;
    const titleText = decodeHtml(item.title?.rendered ?? '').trim();
    const excerptFromTitle = titleText ? `<p>${titleText}</p>` : null;

    const heroImageUrl = gridEntry?.imageUrl ?? heroImage;
    const heroImageAlt = gridEntry?.imageAlt ?? heroAlt;

    let heroImagePath = heroImageUrl ?? heroImage;
    let ogImagePath = ogImage;

    if (!skipMedia && heroImageUrl && typeof heroImageUrl === 'string') {
      const ext = getUrlExtension(heroImageUrl) ?? 'bin';
      heroImagePath = await downloadMediaFile(heroImageUrl, `games/${slug}.${ext}`);
    }

    if (!skipMedia && ogImage && typeof ogImage === 'string') {
      if (heroImageUrl && ogImage === heroImageUrl) {
        ogImagePath = heroImagePath;
      } else {
        const ext = getUrlExtension(ogImage) ?? 'bin';
        ogImagePath = await downloadMediaFile(ogImage, `seo/${slug}.${ext}`);
      }
    }

    const mapped = {
      slug,
      title: decodeHtml(item.title?.rendered ?? ''),
      excerpt_html: excerptFromWp || excerptFromGrid || excerptFromContent || excerptFromSeo || excerptFromTitle,
      body_html: item.content?.rendered ?? null,
      hero_image: heroImagePath,
      hero_image_alt: heroImageAlt,
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
        og_image: ogImagePath || null,
      },
    };

    processed += 1;
    if (!onlySlug && processed % 25 === 0) {
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

  const outputPath = outputOverride
    ? path.resolve(outputOverride)
    : path.resolve(onlySlug ? `backend/scripts/legacy-game.${onlySlug}.json` : 'backend/scripts/legacy-games.json');

  const json = JSON.stringify(payload, null, 2);

  if (writeStdout || onlySlug) {
    process.stdout.write(`${json}\n`);
  }

  if (!writeStdout) {
    await fs.writeFile(outputPath, json);
    console.log(`Saved ${mappedGames.length} games to ${outputPath}`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
