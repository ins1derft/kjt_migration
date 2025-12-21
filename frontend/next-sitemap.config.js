/** @type {import('next-sitemap').IConfig} */
const fs = require('fs');
const path = require('path');

const loadEnvFile = (envPath) => {
  if (!fs.existsSync(envPath)) return;
  const contents = fs.readFileSync(envPath, 'utf8');
  contents.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const idx = trimmed.indexOf('=');
    if (idx === -1) return;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  });
};

const envName = process.env.NODE_ENV === 'production' ? 'production' : 'development';
loadEnvFile(path.resolve(__dirname, '..', `.env.${envName}`));

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://kidsjumptech.com').replace(/\/+$/, '');
const apiBase = (
  process.env.SITEMAP_API_BASE ||
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.APP_URL ? `${process.env.APP_URL.replace(/\/+$/, '')}/api` : '')
).replace(/\/+$/, '');

async function fetchAll(path) {
  if (!apiBase) return [];
  let page = 1;
  const results = [];

  while (true) {
    const url = `${apiBase}${path}${path.includes('?') ? '&' : '?'}page=${page}`;
    try {
      const res = await fetch(url, { headers: { accept: 'application/json' } });
      if (!res.ok) break;
      const json = await res.json();
      const data = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
      results.push(...data);

      const current = json?.meta?.current_page ?? page;
      const last = json?.meta?.last_page ?? current;
      if (current >= last || data.length === 0) break;
      page += 1;
    } catch (e) {
      console.warn('next-sitemap: failed to fetch', url, e);
      break;
    }
  }

  return results;
}

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 7000,
  exclude: ['/admin', '/api/*'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/storage', '/build', '/vendor'] },
    ],
  },
  additionalPaths: async () => {
    const now = new Date().toISOString();
    const staticPaths = [
      { loc: `${siteUrl}/`, lastmod: now, changefreq: 'weekly', priority: 1 },
      { loc: `${siteUrl}/games`, lastmod: now, changefreq: 'weekly', priority: 0.7 },
      { loc: `${siteUrl}/news`, lastmod: now, changefreq: 'daily', priority: 0.7 },
      { loc: `${siteUrl}/store`, lastmod: now, changefreq: 'weekly', priority: 0.5 },
    ];

    const [articles, games, storeProducts] = await Promise.all([
      fetchAll('/articles?limit=100'),
      fetchAll('/games?limit=100&filter[is_indexable]=true'),
      fetchAll('/store/products?limit=100&filter[available]=true'),
    ]);

    const articlePaths = articles.map((article) => ({
      loc: `${siteUrl}/news/${article.slug}`,
      lastmod: article.published_at || now,
      changefreq: 'weekly',
      priority: 0.6,
    }));

    const gamePaths = games.map((game) => ({
      loc: `${siteUrl}/games/${game.slug}`,
      lastmod: game.updated_at || now,
      changefreq: 'monthly',
      priority: 0.5,
    }));

    const storePaths = storeProducts.map((product) => ({
      loc: `${siteUrl}/store/${product.slug}`,
      lastmod: product.updated_at || now,
      changefreq: 'weekly',
      priority: product.is_available ? 0.5 : 0.4,
    }));

    return [...staticPaths, ...articlePaths, ...gamePaths, ...storePaths];
  },
};
