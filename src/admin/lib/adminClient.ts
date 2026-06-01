/**
 * Admin data client.
 *
 * STEP 2: backed by an in-memory store seeded from `mockData`. Mutations
 * live only for the page session (a reload resets them). Every method is
 * async and returns the exact shapes the REST API does, so STEP 3 can
 * replace these bodies with `fetch('/api/...')` without touching any page.
 *
 * The method surface deliberately mirrors the endpoints:
 *   products  → GET/POST /api/products, GET/PUT/DELETE /api/products/[id]
 *   orders    → GET/POST /api/orders,   GET/PUT       /api/orders/[id]
 *   coupons   → GET/POST /api/coupons,  PUT/DELETE    /api/coupons/[id]
 *   stock     → GET/PUT  /api/stock/today
 *   dashboard → GET      /api/dashboard/stats
 */
import type {
  Coupon,
  CouponInput,
  CouponPatch,
  DailyStock,
  DashboardStats,
  Order,
  OrderPatch,
  OrderStatus,
  Product,
  ProductInput,
  ProductPatch,
  TopProduct,
} from '../../types'
import {
  seedCoupons,
  seedOrders,
  seedProducts,
  seedStock,
} from '../data/mockData'

/* ── In-memory store (deep-cloned from the seeds) ──────────────── */

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

const db = {
  products: clone(seedProducts) as Product[],
  orders: clone(seedOrders) as Order[],
  coupons: clone(seedCoupons) as Coupon[],
  stock: clone(seedStock) as DailyStock,
}

/* Simulate network latency so loading states are exercised in the UI. */
const LATENCY_MS = 280
function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS))
}

function nowIso(): string {
  return new Date().toISOString()
}

function notFound(what: string): never {
  throw new Error(`${what} bulunamadı`)
}

/* ── Products ──────────────────────────────────────────────────── */

export interface ProductFilter {
  category?: string
  featured?: boolean
  available?: boolean
}

const products = {
  list(filter: ProductFilter = {}): Promise<Product[]> {
    let rows = db.products
    if (filter.category) rows = rows.filter((p) => p.category === filter.category)
    if (filter.featured) rows = rows.filter((p) => p.featured)
    if (filter.available) rows = rows.filter((p) => p.available)
    return delay(clone(rows))
  },

  get(id: string): Promise<Product> {
    const found = db.products.find((p) => p.id === id)
    return found ? delay(clone(found)) : delay(null).then(() => notFound('Ürün'))
  },

  create(input: ProductInput): Promise<Product> {
    const ts = nowIso()
    const product: Product = { ...clone(input), id: makeProductId(input.slug), createdAt: ts, updatedAt: ts }
    db.products.unshift(product)
    syncStockForNewProduct(product)
    return delay(clone(product))
  },

  update(id: string, patch: ProductPatch): Promise<Product> {
    const row = db.products.find((p) => p.id === id)
    if (!row) return delay(null).then(() => notFound('Ürün'))
    Object.assign(row, clone(patch), { updatedAt: nowIso() })
    return delay(clone(row))
  },

  remove(id: string): Promise<{ ok: true }> {
    db.products = db.products.filter((p) => p.id !== id)
    db.stock.availableProductIds = db.stock.availableProductIds.filter((pid) => pid !== id)
    return delay({ ok: true } as const)
  },
}

function makeProductId(slug: string): string {
  const base = slug.trim() || 'urun'
  if (!db.products.some((p) => p.id === base)) return base
  let n = 2
  while (db.products.some((p) => p.id === `${base}-${n}`)) n += 1
  return `${base}-${n}`
}

function syncStockForNewProduct(p: Product): void {
  if (p.available && !db.stock.availableProductIds.includes(p.id)) {
    db.stock.availableProductIds.push(p.id)
  }
}

/* ── Orders ────────────────────────────────────────────────────── */

const orders = {
  list(): Promise<Order[]> {
    const rows = [...db.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return delay(clone(rows))
  },

  get(id: string): Promise<Order> {
    const found = db.orders.find((o) => o.id === id)
    return found ? delay(clone(found)) : delay(null).then(() => notFound('Sipariş'))
  },

  update(id: string, patch: OrderPatch): Promise<Order> {
    const row = db.orders.find((o) => o.id === id)
    if (!row) return delay(null).then(() => notFound('Sipariş'))
    if (patch.status !== undefined) row.status = patch.status
    if (patch.trackingNo !== undefined) row.trackingNo = patch.trackingNo
    if (patch.courier !== undefined) row.courier = patch.courier
    return delay(clone(row))
  },
}

/* ── Coupons ───────────────────────────────────────────────────── */

const coupons = {
  list(): Promise<Coupon[]> {
    return delay(clone(db.coupons))
  },

  /** Upsert by code — matches the idempotent POST /api/coupons behaviour. */
  create(input: CouponInput): Promise<Coupon> {
    const code = input.code.trim().toUpperCase()
    const next: Coupon = { ...clone(input), code }
    const existing = db.coupons.findIndex((c) => c.code === code)
    if (existing >= 0) db.coupons[existing] = next
    else db.coupons.unshift(next)
    return delay(clone(next))
  },

  update(code: string, patch: CouponPatch): Promise<Coupon> {
    const row = db.coupons.find((c) => c.code === code)
    if (!row) return delay(null).then(() => notFound('Kupon'))
    Object.assign(row, clone(patch))
    return delay(clone(row))
  },

  remove(code: string): Promise<{ ok: true }> {
    db.coupons = db.coupons.filter((c) => c.code !== code)
    return delay({ ok: true } as const)
  },
}

/* ── Daily stock ───────────────────────────────────────────────── */

const stock = {
  get(): Promise<DailyStock> {
    return delay(clone(db.stock))
  },

  set(availableProductIds: string[]): Promise<DailyStock> {
    db.stock = { date: db.stock.date, availableProductIds: [...availableProductIds] }
    // Keep each product's own `available` flag in sync with today's stock.
    for (const p of db.products) p.available = availableProductIds.includes(p.id)
    return delay(clone(db.stock))
  },
}

/* ── Dashboard ─────────────────────────────────────────────────── */

const RECENT_LIMIT = 10
const TOP_LIMIT = 5

function emptyBreakdown(): Record<OrderStatus, number> {
  return { received: 0, preparing: 0, shipping: 0, delivered: 0, cancelled: 0 }
}

const dashboard = {
  stats(): Promise<DashboardStats> {
    const all = [...db.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    const statusBreakdown = emptyBreakdown()
    const topMap = new Map<string, TopProduct>()
    let revenue = 0

    for (const order of all) {
      statusBreakdown[order.status] += 1
      if (order.status === 'cancelled') continue
      revenue += order.total
      for (const item of order.items) {
        const current = topMap.get(item.productId) ?? {
          productId: item.productId,
          name: item.name,
          quantity: 0,
          revenue: 0,
        }
        current.quantity += item.quantity
        current.revenue += item.price * item.quantity
        topMap.set(item.productId, current)
      }
    }

    const topProducts = [...topMap.values()]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, TOP_LIMIT)

    const stats: DashboardStats = {
      revenue,
      orderCount: all.length,
      statusBreakdown,
      topProducts,
      recentOrders: clone(all.slice(0, RECENT_LIMIT)),
    }
    return delay(stats)
  },
}

export const adminClient = { products, orders, coupons, stock, dashboard }
