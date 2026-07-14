/**
 * Regenerate public/sitemap.xml from the real routes (App.tsx) + blog slugs.
 *
 * Domain: floraartfethiye.com. Every page is emitted in all three languages
 * (tr = no prefix, /en, /ru) with reciprocal hreflang alternates (+ x-default).
 * Excluded: /shop (no route), /checkout & /order-success (robots-disallowed),
 * /product/:id (KV-UUID URLs, not derivable statically).
 *
 * Usage: node scripts/gen-sitemap.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = 'https://floraartfethiye.com'
const LASTMOD = '2026-07-14'
const LANGS = ['tr', 'en', 'ru']

// Blog slugs straight from the content source.
const blog = readFileSync(join(ROOT, 'src/data/blogContent.ts'), 'utf8')
const slugs = [...blog.matchAll(/\bslug:\s*'([^']+)'/g)].map((m) => m[1])

// Real, indexable pages (path without language prefix).
const pages = [
  { path: '', priority: '1.0', changefreq: 'weekly' }, // home
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/delivery', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
  { path: '/services', priority: '0.8', changefreq: 'monthly' },
  { path: '/blog', priority: '0.6', changefreq: 'weekly' },
  { path: '/kvkk', priority: '0.3', changefreq: 'yearly' },
  ...slugs.map((s) => ({ path: `/blog/${s}`, priority: '0.6', changefreq: 'monthly' })),
]

const loc = (lang, path) => {
  const prefix = lang === 'tr' ? '' : `/${lang}`
  if (path === '') return `${BASE}${prefix === '' ? '/' : prefix}` // home: /, /en, /ru
  return `${BASE}${prefix}${path}`
}

const alternates = (path) =>
  [
    ...LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${loc(l, path)}"/>`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${loc('tr', path)}"/>`,
  ].join('\n')

const urls = []
for (const pg of pages) {
  for (const lang of LANGS) {
    urls.push(
      `  <url>\n` +
        `    <loc>${loc(lang, pg.path)}</loc>\n` +
        `${alternates(pg.path)}\n` +
        `    <lastmod>${LASTMOD}</lastmod>\n` +
        `    <changefreq>${pg.changefreq}</changefreq>\n` +
        `    <priority>${pg.priority}</priority>\n` +
        `  </url>`,
    )
  }
}

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
  `${urls.join('\n')}\n` +
  `</urlset>\n`

writeFileSync(join(ROOT, 'public/sitemap.xml'), xml)
console.log(
  `sitemap.xml yazıldı: ${pages.length} sayfa × ${LANGS.length} dil = ${urls.length} URL (${slugs.length} blog slug)`,
)
