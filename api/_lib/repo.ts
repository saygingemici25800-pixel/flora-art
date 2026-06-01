/**
 * Data-access layer over Vercel KV. Handlers stay thin; all key wrangling,
 * id generation and set bookkeeping lives here.
 */
import { randomUUID } from 'node:crypto'
import { kv, keys } from './kv'
import type {
  Coupon,
  CouponPatch,
  DailyStock,
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
