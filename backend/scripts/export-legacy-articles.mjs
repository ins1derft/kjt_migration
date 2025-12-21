import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const SITE = 'https://kidsjumptech.com';
const BASE = `${SITE}/wp-json/wp/v2`;

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

function stripHtml(input) {
  if (!input) return '';
  return String(input)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function makeExcerptHtml(bodyHtml, maxChars = 220) {
  const text = decodeHtml(stripHtml(bodyHtml));
  if (!text) return null;
  if (text.length <= maxChars) return `<p>${text}</p>`;
  const slice = text.slice(0, maxChars);
  const lastSpaceIdx = slice.lastIndexOf(' ');
  const candidate = lastSpaceIdx > 90 ? slice.slice(0, lastSpaceIdx) : slice;
  const trimmed = candidate.trim().replace(/[.,;:!?]+$/g, '');
  return `<p>${trimmed}…</p>`;
}

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

function sha1Short(value) {
  return crypto.createHash('sha1').update(String(value)).digest('hex').slice(0, 10);
}

function sanitizeFileName(value) {
  return String(value)
    .trim()
    .replace(/%[0-9A-Fa-f]{2}/g, '-')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

async function downloadMediaFile(url, relativePath, { timeoutSeconds = 90 } = {}) {
  const absolutePath = path.join(MEDIA_ROOT, relativePath);
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });

  const safeUrl = encodeURI(String(url));

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
      safeUrl,
    ],
    { maxBuffer: 8 * 1024 * 1024 }
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

function parseNewsFilterCategories(html) {
  if (!html) return [];

  const categories = [];
  const btnRe = /<button\b[^>]*class="[^"]*\bg-filters-item\b[^"]*"[^>]*data-taxonomy="([^"]+)"[^>]*>([\s\S]*?)<\/button>/gi;
  let match;
  while ((match = btnRe.exec(html))) {
    const slug = match[1];
    if (!slug || slug === '*') continue;
    const inner = match[2];
    const labelMatch = inner.match(/<span>([\s\S]*?)<\/span>/i);
    const name = decodeHtml(stripHtml(labelMatch ? labelMatch[1] : inner)).trim();
    if (!name) continue;
    categories.push({ slug, name, description: null });
  }

  return categories;
}

function parseNewsGridEntries(html) {
  if (!html) return [];

  const entries = [];
  const articleRe = /<article\b[^>]*class="[^"]*\bw-grid-item\b[^"]*"[^>]*>[\s\S]*?<\/article>/gi;
  let match;
  while ((match = articleRe.exec(html))) {
    const articleHtml = match[0];

    const idMatch = articleHtml.match(/\bdata-id="(\d+)"/i);
    const legacyId = idMatch ? Number(idMatch[1]) : null;

    const hrefMatch = articleHtml.match(/href="(https?:\/\/kidsjumptech\.com\/news\/[^"]+)"/i);
    const legacyUrl = hrefMatch ? hrefMatch[1] : null;
    if (!legacyUrl) continue;

    let slug = null;
    try {
      const urlObj = new URL(legacyUrl);
      const parts = urlObj.pathname.split('/').filter(Boolean);
      slug = parts[parts.length - 1] || null;
    } catch {
      // ignore
    }

    if (!slug) continue;
    if (onlySlug && slug !== onlySlug) continue;

    const timeMatch = articleHtml.match(/<time\b[^>]*datetime="([^"]+)"[^>]*>/i);
    const publishedAt = timeMatch ? timeMatch[1] : null;

    const titleMatch = articleHtml.match(/<h3\b[^>]*class="[^"]*\bpost_title\b[^"]*"[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i);
    const title = titleMatch ? decodeHtml(stripHtml(titleMatch[1])) : null;

    const excerptMatch = articleHtml.match(/<div class="w-post-elm post_content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    const excerptText = excerptMatch ? decodeHtml(stripHtml(excerptMatch[1])) : null;
    const excerptHtml = excerptText ? `<p>${excerptText}</p>` : null;

    const imgSrcMatch = articleHtml.match(/<img[^>]*\ssrc="([^"]+)"/i);
    const imageUrl = imgSrcMatch ? imgSrcMatch[1] : null;

    const classAttrMatch = articleHtml.match(/\bclass="([^"]+)"/i);
    const classAttr = classAttrMatch ? classAttrMatch[1] : '';
    const categorySlugs = Array.from(classAttr.matchAll(/\bcategory-([a-z0-9-]+)\b/gi))
      .map((m) => m[1])
      .filter(Boolean);

    entries.push({
      id: legacyId,
      slug,
      legacyUrl,
      published_at: publishedAt,
      title,
      excerpt_html: excerptHtml,
      image_url: imageUrl,
      category_slugs: Array.from(new Set(categorySlugs)),
    });
  }

  return entries;
}

async function scrapeNewsGrid({ slug: targetSlug } = {}) {
  const gridHtml = await fetchTextWithTimeout(`${SITE}/news/`, { timeoutMs: 25000, retries: 2 });
  if (!gridHtml) {
    throw new Error('Failed to fetch legacy news grid HTML.');
  }

  const config = parseGridConfig(gridHtml);
  const maxPages = Number(config?.max_num_pages ?? 1) || 1;
  const categories = parseNewsFilterCategories(gridHtml);
  const categorySet = new Set(categories.map((c) => c.slug));

  const entriesById = new Map();
  const entriesBySlug = new Map();
  for (const entry of parseNewsGridEntries(gridHtml)) {
    if (!entry.slug) continue;
    const filteredSlugs = entry.category_slugs.filter((slug) => categorySet.has(slug));
    const normalized = { ...entry, category_slugs: filteredSlugs };
    if (normalized.id) entriesById.set(normalized.id, normalized);
    entriesBySlug.set(normalized.slug, normalized);
  }

  if (targetSlug && entriesBySlug.has(targetSlug)) {
    return { config, categories, entriesById, entriesBySlug };
  }

  if (!config?.template_vars) {
    return { config, categories, entriesById, entriesBySlug };
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
      throw new Error(`Failed to fetch legacy news grid page ${page}/${maxPages}.`);
    }

    for (const entry of parseNewsGridEntries(pageHtml)) {
      if (!entry.slug) continue;
      const filteredSlugs = entry.category_slugs.filter((slug) => categorySet.has(slug));
      const normalized = { ...entry, category_slugs: filteredSlugs };
      if (normalized.id) entriesById.set(normalized.id, normalized);
      entriesBySlug.set(normalized.slug, normalized);
    }

    if (targetSlug && entriesBySlug.has(targetSlug)) {
      break;
    }
  }

  return { config, categories, entriesById, entriesBySlug };
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

function findFirstYoutubeMatch(html) {
  if (!html) return null;
  const patterns = [
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/i,
    /youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]{6,})/i,
    /youtu\.be\/([a-zA-Z0-9_-]{6,})/i,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{6,})/i,
  ];
  for (const re of patterns) {
    const m = re.exec(html);
    if (m) return { id: m[1], index: m.index };
  }
  return null;
}

function extractHeroYoutubeId(contentHtml) {
  const first = findFirstYoutubeMatch(contentHtml);
  if (!first) return null;
  const pIdx = typeof contentHtml === 'string' ? contentHtml.search(/<p[\s>]/i) : -1;
  if (first.index >= 0 && (pIdx === -1 || first.index < pIdx) && first.index < 2000) {
    return first.id;
  }
  return null;
}

function stripHeroVideoBlock(bodyHtml, heroVideoId) {
  if (!heroVideoId || !bodyHtml) return bodyHtml;
  const re = new RegExp(
    `<div[^>]*class=\"[^\"]*\\bw-video\\b[^\"]*\"[^>]*>[\\s\\S]*?youtube(?:-nocookie)?\\.com\\/embed\\/${heroVideoId}[\\s\\S]*?<\\/div>\\s*<\\/div>`,
    'i'
  );
  return bodyHtml.replace(re, '');
}

function normalizeIframeSrc(html) {
  if (!html) return html;
  return html.replace(/\bsrc="\/\//gi, 'src="https://');
}

function collectBodyMediaUrls(html) {
  const urls = new Set();
  if (!html) return urls;

  const attrRe = /\b(?:src|data-src|href)="([^"]+)"/gi;
  let match;
  while ((match = attrRe.exec(html))) {
    const raw = match[1];
    if (!raw) continue;
    if (raw.startsWith('data:')) continue;

    const lower = raw.toLowerCase();
    const looksLikeImage =
      lower.includes('/wp-content/') ||
      lower.endsWith('.png') ||
      lower.endsWith('.jpg') ||
      lower.endsWith('.jpeg') ||
      lower.endsWith('.webp') ||
      lower.endsWith('.gif') ||
      lower.endsWith('.svg');

    if (!looksLikeImage) continue;
    urls.add(raw);
  }
  return urls;
}

function normalizeLegacyUrl(value) {
  if (!value) return null;
  if (value.startsWith('data:')) return null;
  if (value.startsWith('//')) return `https:${value}`;
  if (value.startsWith('/')) return `${SITE}${value}`;
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE}/${value.replace(/^\/+/, '')}`;
}

function stripImageSrcset(html) {
  if (!html) return html;
  return html
    .replace(/\s(?:srcset|sizes|data-srcset|data-sizes)="[^"]*"/gi, '')
    .replace(/\sdata-lazy-src="[^"]*"/gi, '');
}

async function localizeBodyImages(bodyHtml, { slug }) {
  if (!bodyHtml) return bodyHtml;
  const urls = Array.from(collectBodyMediaUrls(bodyHtml));
  if (urls.length === 0) return bodyHtml;

  const replacements = new Map();

  for (const rawUrl of urls) {
    const absolute = normalizeLegacyUrl(rawUrl);
    if (!absolute) continue;

    const ext = getUrlExtension(absolute) ?? 'bin';
    let baseName = null;
    try {
      baseName = path.basename(new URL(absolute).pathname);
    } catch {
      baseName = path.basename(absolute);
    }
    baseName = sanitizeFileName(decodeURIComponent(baseName || 'file'));
    if (!baseName) baseName = `file.${ext}`;

    if (!baseName.includes('.')) {
      baseName = `${baseName}.${ext}`;
    }

    const hash = sha1Short(absolute);
    const fileName = `${hash}-${baseName}`;
    const relativePath = `articles/body/${slug}/${fileName}`;

    if (!skipMedia) {
      await downloadMediaFile(absolute, relativePath, { timeoutSeconds: 90 });
    }

    const localUrl = `/storage/${relativePath}`;

    const variants = new Set([rawUrl, absolute]);
    variants.add(absolute.replace(/^https?:/i, ''));
    try {
      variants.add(new URL(absolute).pathname);
    } catch {
      // ignore
    }

    for (const variant of variants) {
      if (variant && typeof variant === 'string') {
        replacements.set(variant, localUrl);
      }
    }
  }

  let nextHtml = bodyHtml;
  for (const [from, to] of replacements.entries()) {
    if (!from) continue;
    nextHtml = nextHtml.split(from).join(to);
  }

  return stripImageSrcset(nextHtml);
}

async function downloadYoutubeOgImage(videoId, slug) {
  const candidates = [
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
  ];

  for (const url of candidates) {
    try {
      const ext = getUrlExtension(url) ?? 'jpg';
      const relativePath = `seo/articles/${slug}.${ext}`;
      if (!skipMedia) {
        await downloadMediaFile(url, relativePath, { timeoutSeconds: 60 });
      }
      return relativePath;
    } catch {
      // try next
    }
  }

  return null;
}

async function run() {
  const { config, categories, entriesById, entriesBySlug } = await scrapeNewsGrid({ slug: onlySlug });

  const maxPages = Number(config?.max_num_pages ?? 1) || 1;
  console.log(`Legacy /news grid: pages=${maxPages}, entries=${entriesBySlug.size}`);

  const ids = Array.from(entriesById.keys()).filter((id) => Number(id) > 0);
  if (ids.length === 0) {
    throw new Error('No legacy posts IDs discovered from /news grid.');
  }

  const posts = [];
  for (let i = 0; i < ids.length; i += 5) {
    const chunk = ids.slice(i, i + 5);
    const chunkPosts = await fetchAll(
      'posts',
      {
        include: chunk.join(','),
        per_page: 100,
        page: 1,
        _fields: 'id,slug,title,excerpt,content,date_gmt,featured_media,yoast_head_json',
      },
      { timeoutMs: 60000, retries: 3 }
    );
    posts.push(...chunkPosts);
    await sleep(150);
  }

  const postsById = new Map(posts.map((p) => [p.id, p]));

  const mediaIds = Array.from(
    new Set(posts.map((p) => p.featured_media).filter((id) => Number(id) > 0))
  );

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

  const categoryNameBySlug = new Map(categories.map((c) => [c.slug, c.name]));

  const mappedArticles = [];
  const entries = Array.from(entriesBySlug.values());

  for (const entry of entries) {
    if (onlySlug && entry.slug !== onlySlug) continue;

    const post = entry.id ? postsById.get(entry.id) : null;
    if (!post) {
      console.warn(`Skipping missing WP post for legacy entry ${entry.slug} (id=${entry.id ?? 'n/a'})`);
      continue;
    }

    const slug = post.slug;
    const title = decodeHtml(post.title?.rendered ?? '').trim();

    const seo = post.yoast_head_json || {};
    const ogImageUrl =
      Array.isArray(seo.og_image) && seo.og_image.length ? seo.og_image[0]?.url : null;

    const featuredMedia = mediaMap.get(post.featured_media);
    const featuredImageUrl = featuredMedia?.source_url ?? null;

    const contentHtmlRaw = post.content?.rendered ?? '';
    const heroVideoId = extractHeroYoutubeId(contentHtmlRaw);

    let bodyHtml = contentHtmlRaw;
    if (heroVideoId) {
      bodyHtml = stripHeroVideoBlock(bodyHtml, heroVideoId);
    }
    bodyHtml = normalizeIframeSrc(bodyHtml);
    bodyHtml = await localizeBodyImages(bodyHtml, { slug });

    const excerptFromWp = (post.excerpt?.rendered ?? '').trim();
    const excerptFromGrid = (entry.excerpt_html ?? '').trim();
    const excerptFromContent = makeExcerptHtml(contentHtmlRaw, 220);
    const seoDescription = typeof seo.description === 'string' ? seo.description.trim() : '';
    const excerptFromSeo = seoDescription ? `<p>${decodeHtml(seoDescription)}</p>` : null;
    const excerptFromTitle = title ? `<p>${title}</p>` : null;

    let excerptHtml = excerptFromWp || excerptFromGrid || excerptFromContent || excerptFromSeo || excerptFromTitle;
    if (excerptHtml && !/<[a-z][\s\S]*>/i.test(excerptHtml)) {
      const safeText = decodeHtml(String(excerptHtml)).trim();
      excerptHtml = safeText ? `<p>${safeText}</p>` : null;
    }

    let featuredImagePath = null;
    let seoOgImagePath = null;

    if (!heroVideoId) {
      const heroImageUrl = featuredImageUrl || ogImageUrl || entry.image_url || null;
      if (!skipMedia && heroImageUrl && typeof heroImageUrl === 'string') {
        const ext = getUrlExtension(heroImageUrl) ?? 'bin';
        featuredImagePath = await downloadMediaFile(heroImageUrl, `articles/${slug}.${ext}`);
      } else {
        featuredImagePath = heroImageUrl || null;
      }
    }

    if (ogImageUrl && typeof ogImageUrl === 'string') {
      if (featuredImageUrl && ogImageUrl === featuredImageUrl && featuredImagePath && !String(featuredImagePath).startsWith('http')) {
        seoOgImagePath = featuredImagePath;
      } else if (!skipMedia) {
        const ext = getUrlExtension(ogImageUrl) ?? 'bin';
        seoOgImagePath = await downloadMediaFile(ogImageUrl, `seo/articles/${slug}.${ext}`);
      } else {
        seoOgImagePath = ogImageUrl;
      }
    } else if (heroVideoId) {
      seoOgImagePath = await downloadYoutubeOgImage(heroVideoId, slug);
    } else if (featuredImagePath && !String(featuredImagePath).startsWith('http')) {
      seoOgImagePath = featuredImagePath;
    }

    const mappedCategories = (entry.category_slugs || [])
      .filter(Boolean)
      .map((categorySlug) => ({
        slug: categorySlug,
        name: categoryNameBySlug.get(categorySlug) || categorySlug,
      }));

    mappedArticles.push({
      slug,
      title,
      published_at: entry.published_at || (post.date_gmt ? `${post.date_gmt}Z` : null),
      excerpt_html: excerptHtml || null,
      body_html: bodyHtml || '',
      featured_image: heroVideoId ? null : featuredImagePath,
      video_id: heroVideoId,
      seo: {
        title: seo.title || null,
        description: seo.description || null,
        canonical: seo.canonical || null,
        og_image: seoOgImagePath || null,
      },
      categories: mappedCategories,
      legacy_url: entry.legacyUrl ?? null,
    });
  }

  const payload = {
    source: SITE,
    exported_at: new Date().toISOString(),
    grid: {
      max_pages: maxPages,
      entries_count: entriesBySlug.size,
    },
    categories,
    articles: mappedArticles,
  };

  const outputPath = outputOverride
    ? path.resolve(outputOverride)
    : path.resolve(onlySlug ? `backend/scripts/legacy-article.${onlySlug}.json` : 'backend/scripts/legacy-articles.json');

  const json = JSON.stringify(payload, null, 2);

  if (writeStdout || onlySlug) {
    process.stdout.write(`${json}\n`);
  }

  if (!writeStdout) {
    await fs.writeFile(outputPath, json);
    console.log(`Saved ${mappedArticles.length} articles to ${outputPath}`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
