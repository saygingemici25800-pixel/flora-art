/**
 * Surgical category migration — fixes ONLY the `category` field of existing
 * products in KV. Does not add/delete products, does not touch products:all,
 * never runs the seed.
 *
 *   category 'corporate'                      → 'wreath'
 *   category 'wedding' & name has "çelenk"    → 'wreath'
 *   category 'wedding' & name has no "çelenk" → 'weddingcar'
 *   anything else (bouquet/box/plant/already wreath|weddingcar) → untouched
 *
 * Usage:
 *   node scripts/migrate-categories.mjs            # DRY-RUN (default, no writes)
 *   node scripts/migrate-categories.mjs --apply    # live write (set only, same key)
 *
 * Reads KV credentials from .env.local (KV_REST_API_URL / KV_REST_API_TOKEN),
 * same connection style as the read-only inspectors.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createClient } from '@vercel/kv'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const APPLY = process.argv.includes('--apply')

// --- KV credentials from .env.local ---
const env = {}
for (const line of readFileSync(join(ROOT, '.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}
const kv = createClient({ url: env.KV_REST_API_URL, token: env.KV_REST_API_TOKEN })

// --- Migration rule (category-only) ---
function targetCategory(product) {
  const cat = product.category
  if (cat === 'corporate') return 'wreath'
  if (cat === 'wedding') {
    const name = (product.name && (product.name.tr ?? product.name)) || ''
    // "çelenk" stem — matches çelenk / çelengi / çelenkler (Turkish softening).
    return name.toLocaleLowerCase('tr').includes('çelen') ? 'wreath' : 'weddingcar'
  }
  return cat // untouched
}

// --- Read all products (products:all → product:<id>) ---
const ids = await kv.smembers('products:all')
const products = []
for (const id of ids) {
  const p = await kv.get(`product:${id}`)
  if (p) products.push(p)
}

// --- Compute changes ---
const changes = []
for (const p of products) {
  const next = targetCategory(p)
  if (next !== p.category) changes.push({ product: p, from: p.category, to: next })
}

// --- Distribution helpers ---
const KNOWN = ['bouquet', 'box', 'plant', 'wreath', 'weddingcar']
function distribution(getCat) {
  const d = {}
  for (const p of products) {
    const c = getCat(p)
    d[c] = (d[c] || 0) + 1
  }
  return d
}
const before = distribution((p) => p.category)
const changeMap = new Map(changes.map((c) => [c.product, c.to]))
const after = distribution((p) => changeMap.get(p) ?? p.category)

function fmtDist(d) {
  const parts = KNOWN.map((k) => `${k}=${d[k] || 0}`)
  const extras = Object.keys(d).filter((k) => !KNOWN.includes(k))
  for (const k of extras) parts.push(`${k}=${d[k]} (!! beklenmeyen)`)
  return parts.join('  ')
}

// --- Report ---
console.log(`MODE: ${APPLY ? 'LIVE (--apply)' : 'DRY-RUN (varsayılan — yazma yok)'}`)
console.log(`Toplam ürün: ${products.length}  |  Değişecek: ${changes.length}\n`)
console.log('Değişecek ürünler:')
console.log('-'.repeat(78))
for (const { product, from, to } of changes) {
  const nm = (product.name && (product.name.tr ?? product.name)) || '(isimsiz)'
  console.log(`  ${from} → ${to} | ${nm} | ${product.price}₺`)
}
if (changes.length === 0) console.log('  (değişecek ürün yok)')
console.log('-'.repeat(78))
console.log('Kategori dağılımı ÖNCE :', fmtDist(before))
console.log('Kategori dağılımı SONRA:', fmtDist(after))
console.log(`Toplam ürün (değişmez) : ${products.length}`)

// --- Live write (only with --apply) ---
if (APPLY) {
  if (changes.length === 0) {
    console.log('\nUygulanacak değişiklik yok.')
  } else {
    const pipeline = kv.pipeline()
    const ts = new Date().toISOString()
    for (const { product, to } of changes) {
      const updated = { ...product, category: to, updatedAt: ts }
      pipeline.set(`product:${product.id}`, updated)
    }
    await pipeline.exec()
    console.log(`\n✅ APPLIED: ${changes.length} ürünün kategorisi güncellendi (set, aynı key; products:all'a dokunulmadı).`)
  }
} else {
  console.log('\n(DRY-RUN — hiçbir şey yazılmadı. Canlı için: node scripts/migrate-categories.mjs --apply)')
}
