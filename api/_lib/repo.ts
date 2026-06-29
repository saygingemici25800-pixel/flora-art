/**
 * Data-access layer over Vercel KV. Handlers stay thin; all key wrangling,
 * id generation and set bookkeeping lives here.
 */
import { randomUUID } from 'node:crypto'
import { kv, keys } from './kv'
import type {
  CategoryId,
  Coupon,
  CouponPatch,
  DailyStock,
  Localized,
  Order,
  OrderInput,
  OrderPatch,
  Product,
  ProductInput,
  ProductPatch,
} from '../../src/types'

function nowIso(): string {
  return new Date().toISOString()
}

/* ── Products ───────────────────────────────────────────────────── */

export async function listProducts(): Promise<Product[]> {
  const ids = await kv.smembers(keys.productsAll)
  if (ids.length === 0) return []
  const records = await kv.mget<Product[]>(...ids.map(keys.product))
  return records.filter((p): p is Product => p !== null)
}

export async function getProduct(id: string): Promise<Product | null> {
  return kv.get<Product>(keys.product(id))
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const id = randomUUID()
  const ts = nowIso()
  const product: Product = { ...input, id, createdAt: ts, updatedAt: ts }
  await kv.set(keys.product(id), product)
  await kv.sadd(keys.productsAll, id)
  return product
}

export async function updateProduct(
  id: string,
  patch: ProductPatch,
): Promise<Product | null> {
  const existing = await getProduct(id)
  if (!existing) return null
  const updated: Product = {
    ...existing,
    ...patch,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: nowIso(),
  }
  await kv.set(keys.product(id), updated)
  return updated
}

export async function deleteProduct(id: string): Promise<boolean> {
  const existing = await getProduct(id)
  if (!existing) return false
  await kv.del(keys.product(id))
  await kv.srem(keys.productsAll, id)
  return true
}

/**
 * Replace the entire product catalogue in one batched pass (used by /api/seed).
 * Clears existing products + the index set, then writes every input through a
 * single pipeline — a few round-trips instead of ~5 per product, so a large
 * catalogue seeds well within the function timeout. Returns the number written.
 */
export async function replaceAllProducts(
  inputs: ProductInput[],
): Promise<number> {
  const existingIds = await kv.smembers(keys.productsAll)
  if (existingIds.length > 0) {
    const productKeys = existingIds.map((id) => keys.product(id))
    // Guarded above as non-empty; del needs a non-empty tuple.
    await kv.del(...(productKeys as [string, ...string[]]))
  }
  await kv.del(keys.productsAll)
  if (inputs.length === 0) return 0

  const ts = nowIso()
  const products: Product[] = inputs.map((input) => ({
    ...input,
    id: randomUUID(),
    createdAt: ts,
    updatedAt: ts,
  }))

  const pipeline = kv.pipeline()
  for (const p of products) {
    pipeline.set(keys.product(p.id), p)
  }
  const productIds = products.map((p) => p.id)
  // `products` is non-empty here (inputs.length === 0 returned above).
  pipeline.sadd(keys.productsAll, ...(productIds as [string, ...string[]]))
  await pipeline.exec()

  return products.length
}

/* ── Safe seed (non-destructive upsert) ─────────────────────────────
 * Alternative to replaceAllProducts that NEVER deletes. Each seed entry is
 * matched to an existing product by, in order: seedKey → slug → normalized name.
 * On a match it PRESERVES the admin-owned fields (name, price, oldPrice,
 * available, featured, hidden), REFRESHES the seed-owned fields (category,
 * motif, seedKey), and FILLS image/description/badge only when empty — keeping
 * the same id + createdAt (no new UUID). Entries with no match are created.
 * Products that no seed entry matches are left completely untouched.
 */
function normalizeName(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, ' ')
}

function isEmptyLocalized(loc?: Localized): boolean {
  return !loc || (!loc.tr?.trim() && !loc.en?.trim() && !loc.ru?.trim())
}

function hasImage(images?: string[]): boolean {
  return (
    Array.isArray(images) &&
    images.length > 0 &&
    typeof images[0] === 'string' &&
    images[0].trim() !== ''
  )
}

/** Tiny Levenshtein distance, only for dry-run near-duplicate warnings. */
function editDistance(a: string, b: string): number {
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m
  const dp = Array.from({ length: n + 1 }, (_, j) => j)
  for (let i = 1; i <= m; i++) {
    let prev = dp[0]
    dp[0] = i
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j]
      dp[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[j], dp[j - 1])
      prev = tmp
    }
  }
  return dp[n]
}

export interface UpsertSeedOptions {
  dryRun: boolean
}

export interface UpsertDryRunReport {
  mode: 'dry-run'
  summary: {
    existingProducts: number
    seedEntries: number
    wouldMatch: number
    wouldCreate: number
    wouldPreserveUntouched: number
    suspiciousNearMatches: number
  }
  wouldMatch: Array<{
    seedKey: string
    name: string
    kvName: string
    kvPrice: number
    categoryChange: string | null
  }>
  wouldCreate: Array<{ name: string; category: CategoryId; price: number }>
  wouldPreserveUntouched: Array<{ name: string; price: number; category: CategoryId }>
  suspiciousNearMatches: Array<{
    seedName: string
    kvName: string
    kvId: string
    distance: number
  }>
}

export interface UpsertLiveReport {
  mode: 'live'
  matched: number
  created: number
  untouched: number
}

export type UpsertSeedReport = UpsertDryRunReport | UpsertLiveReport

export async function upsertSeed(
  entries: ProductInput[],
  opts: UpsertSeedOptions,
): Promise<UpsertSeedReport> {
  const existing = await listProducts()

  const bySeedKey = new Map<string, Product>()
  const bySlug = new Map<string, Product>()
  const byNorm = new Map<string, Product>()
  for (const p of existing) {
    if (p.seedKey) bySeedKey.set(p.seedKey, p)
    if (p.slug) bySlug.set(p.slug, p)
    byNorm.set(normalizeName(p.name.tr), p)
  }
  // Normalized seed names that match some entry exactly — used to silence
  // false near-duplicate warnings (those products are legit matches elsewhere).
  const seedNormNames = new Set(entries.map((e) => normalizeName(e.name.tr)))

  const matchedIds = new Set<string>()
  const matchDecisions: Array<{ hit: Product; merged: Product }> = []
  const newEntries: ProductInput[] = []
  const nearWarnings: UpsertDryRunReport['suspiciousNearMatches'] = []

  for (const entry of entries) {
    const sk = entry.seedKey ?? entry.slug
    const norm = normalizeName(entry.name.tr)
    let hit =
      bySeedKey.get(sk) ??
      bySlug.get(entry.slug) ??
      bySlug.get(sk) ??
      byNorm.get(norm)
    if (hit && matchedIds.has(hit.id)) hit = undefined // already claimed

    if (hit) {
      matchedIds.add(hit.id)
      const merged: Product = {
        ...hit, // PRESERVE: name, price, oldPrice, available, featured, hidden, slug, seo*
        category: entry.category, // UPDATE (seed-owned)
        motif: entry.motif, // UPDATE (seed-owned)
        seedKey: sk, // stamp permanent key
        images: hasImage(hit.images) ? hit.images : entry.images, // FILL if empty
        description: isEmptyLocalized(hit.description)
          ? entry.description
          : hit.description, // FILL if empty
        badge: hit.badge ?? entry.badge, // FILL if empty
        id: hit.id,
        createdAt: hit.createdAt,
        updatedAt: nowIso(),
      }
      matchDecisions.push({ hit, merged })
    } else {
      newEntries.push(entry)
      let best: { product: Product; distance: number } | null = null
      for (const p of existing) {
        const pn = normalizeName(p.name.tr)
        if (seedNormNames.has(pn)) continue // matches some entry exactly → not suspicious
        const d = editDistance(norm, pn)
        if (best === null || d < best.distance) best = { product: p, distance: d }
      }
      if (best && best.distance > 0 && best.distance <= 3) {
        nearWarnings.push({
          seedName: entry.name.tr,
          kvName: best.product.name.tr,
          kvId: best.product.id,
          distance: best.distance,
        })
      }
    }
  }

  const untouched = existing.filter((p) => !matchedIds.has(p.id))

  if (opts.dryRun) {
    return {
      mode: 'dry-run',
      summary: {
        existingProducts: existing.length,
        seedEntries: entries.length,
        wouldMatch: matchDecisions.length,
        wouldCreate: newEntries.length,
        wouldPreserveUntouched: untouched.length,
        suspiciousNearMatches: nearWarnings.length,
      },
      wouldMatch: matchDecisions.map(({ hit, merged }) => ({
        seedKey: merged.seedKey ?? '',
        name: merged.name.tr,
        kvName: hit.name.tr,
        kvPrice: hit.price,
        categoryChange:
          hit.category !== merged.category
            ? `${hit.category}→${merged.category}`
            : null,
      })),
      wouldCreate: newEntries.map((e) => ({
        name: e.name.tr,
        category: e.category,
        price: e.price,
      })),
      wouldPreserveUntouched: untouched.map((p) => ({
        name: p.name.tr,
        price: p.price,
        category: p.category,
      })),
      suspiciousNearMatches: nearWarnings,
    }
  }

  // Live apply — one batched pipeline. Only SET (matched + new) and SADD (new
  // ids). No DEL anywhere, so nothing is ever destroyed.
  const pipeline = kv.pipeline()
  for (const { merged } of matchDecisions) {
    pipeline.set(keys.product(merged.id), merged)
  }
  const createdIds: string[] = []
  const ts = nowIso()
  for (const entry of newEntries) {
    const id = randomUUID()
    const product: Product = {
      ...entry,
      seedKey: entry.seedKey ?? entry.slug,
      id,
      createdAt: ts,
      updatedAt: ts,
    }
    pipeline.set(keys.product(id), product)
    createdIds.push(id)
  }
  if (createdIds.length > 0) {
    pipeline.sadd(keys.productsAll, ...(createdIds as [string, ...string[]]))
  }
  await pipeline.exec()

  return {
    mode: 'live',
    matched: matchDecisions.length,
    created: createdIds.length,
    untouched: untouched.length,
  }
}

/* ── Orders ─────────────────────────────────────────────────────── */

function formatOrderNumber(seq: number): string {
  return `#FA-${String(seq).padStart(4, '0')}`
}

export async function createOrder(input: OrderInput): Promise<Order> {
  const id = randomUUID()
  const seq = await kv.incr(keys.ordersCounter)
  const order: Order = {
    ...input,
    id,
    orderNumber: formatOrderNumber(seq),
    createdAt: nowIso(),
    status: 'received',
  }
  await kv.set(keys.order(id), order)
  await kv.sadd(keys.ordersAll, id)
  return order
}

export async function listOrders(): Promise<Order[]> {
  const ids = await kv.smembers(keys.ordersAll)
  if (ids.length === 0) return []
  const records = await kv.mget<Order[]>(...ids.map(keys.order))
  return records
    .filter((o): o is Order => o !== null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function getOrder(id: string): Promise<Order | null> {
  return kv.get<Order>(keys.order(id))
}

export async function updateOrder(
  id: string,
  patch: OrderPatch,
): Promise<Order | null> {
  const existing = await getOrder(id)
  if (!existing) return null
  const updated: Order = {
    ...existing,
    status: patch.status ?? existing.status,
    trackingNo: patch.trackingNo ?? existing.trackingNo,
    courier: patch.courier ?? existing.courier,
  }
  await kv.set(keys.order(id), updated)
  return updated
}

/* ── Coupons ────────────────────────────────────────────────────── */

export async function listCoupons(): Promise<Coupon[]> {
  const codes = await kv.smembers(keys.couponsAll)
  if (codes.length === 0) return []
  const records = await kv.mget<Coupon[]>(...codes.map(keys.coupon))
  return records.filter((c): c is Coupon => c !== null)
}

export async function getCoupon(code: string): Promise<Coupon | null> {
  return kv.get<Coupon>(keys.coupon(code))
}

export async function saveCoupon(coupon: Coupon): Promise<Coupon> {
  await kv.set(keys.coupon(coupon.code), coupon)
  await kv.sadd(keys.couponsAll, coupon.code)
  return coupon
}

export async function updateCoupon(
  code: string,
  patch: CouponPatch,
): Promise<Coupon | null> {
  const existing = await getCoupon(code)
  if (!existing) return null
  const updated: Coupon = { ...existing, ...patch, code: existing.code }
  await kv.set(keys.coupon(code), updated)
  return updated
}

export async function deleteCoupon(code: string): Promise<boolean> {
  const existing = await getCoupon(code)
  if (!existing) return false
  await kv.del(keys.coupon(code))
  await kv.srem(keys.couponsAll, code)
  return true
}

/* ── Daily stock ────────────────────────────────────────────────── */

export async function getStock(date: string): Promise<DailyStock> {
  const stored = await kv.get<DailyStock>(keys.stock(date))
  return stored ?? { date, availableProductIds: [] }
}

export async function setStock(
  date: string,
  availableProductIds: string[],
): Promise<DailyStock> {
  const stock: DailyStock = { date, availableProductIds }
  await kv.set(keys.stock(date), stock)
  return stock
}
