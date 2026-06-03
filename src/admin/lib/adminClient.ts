/**
 * Admin data client — live API (STEP 3).
 *
 * Every method calls the Vercel serverless routes under /api and returns the
 * exact shapes from `src/types`. Auth-gated routes rely on the httpOnly admin
 * cookie, so every request is sent with `credentials: 'include'`. Non-2xx
 * responses throw an Error (message surfaced as a toast by the pages).
 *
 * Endpoint map:
 *   products  → GET/POST /api/products, GET/PUT/DELETE /api/products/[id]
 *   orders    → GET      /api/orders,   GET/PUT       /api/orders/[id]
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
  Product,
  ProductInput,
  ProductPatch,
} from '../../types'

/* ── Low-level request helper ──────────────────────────────────── */

/** Friendly Turkish copy for the API's (English) error strings. */
const ERROR_TR: Record<string, string> = {
  Unauthorized: 'Oturum gerekli. Lütfen tekrar giriş yapın.',
  'Invalid credentials': 'Parola hatalı.',
  'Product not found': 'Ürün bulunamadı.',
  'Order not found': 'Sipariş bulunamadı.',
  'Coupon not found': 'Kupon bulunamadı.',
  'Method Not Allowed': 'İşlem desteklenmiyor.',
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body } = opts

  let res: Response
  try {
    res = await fetch(path, {
      method,
      credentials: 'include', // send the httpOnly admin cookie
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Sunucuya ulaşılamadı. Bağlantınızı kontrol edin.')
  }

  if (!res.ok) {
    let serverMsg: string | undefined
    try {
      const data = (await res.json()) as { error?: string }
      serverMsg = data?.error
    } catch {
      /* non-JSON error body */
    }
    const message =
      (serverMsg && (ERROR_TR[serverMsg] ?? serverMsg)) ?? `İstek başarısız (${res.status})`
    throw new Error(message)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

/* ── Products ──────────────────────────────────────────────────── */

export interface ProductFilter {
  category?: string
  featured?: boolean
  available?: boolean
}

const products = {
  list(filter: ProductFilter = {}): Promise<Product[]> {
    const qs = new URLSearchParams()
    if (filter.category) qs.set('category', filter.category)
    if (filter.featured) qs.set('featured', '1')
    if (filter.available) qs.set('available', '1')
    const suffix = qs.toString() ? `?${qs}` : ''
    return request<Product[]>(`/api/products${suffix}`)
  },

  get(id: string): Promise<Product> {
    return request<Product>(`/api/products/${encodeURIComponent(id)}`)
  },

  create(input: ProductInput): Promise<Product> {
    return request<Product>('/api/products', { method: 'POST', body: input })
  },

  /**
   * The API's PUT expects a COMPLETE product. Callers may pass a partial patch
   * (e.g. the inline availability toggle), so fetch the current record, merge
   * the patch, and send the full input.
   */
  async update(id: string, patch: ProductPatch): Promise<Product> {
    // PUT requires a COMPLETE product, so rebuild the full input from the
    // current record and apply the (possibly partial) patch on top.
    const c = await products.get(id)
    const full: ProductInput = {
      name: c.name,
      slug: c.slug,
      category: c.category,
      price: c.price,
      oldPrice: c.oldPrice,
      description: c.description,
      images: c.images,
      badge: c.badge,
      motif: c.motif,
      available: c.available,
      featured: c.featured,
      seoTitle: c.seoTitle,
      seoDescription: c.seoDescription,
      ...patch,
    }
    return request<Product>(`/api/products/${encodeURIComponent(id)}`, { method: 'PUT', body: full })
  },

  remove(id: string): Promise<{ ok: true }> {
    return request<{ ok: true }>(`/api/products/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },
}

/* ── Orders ────────────────────────────────────────────────────── */

const orders = {
  list(): Promise<Order[]> {
    return request<Order[]>('/api/orders')
  },

  get(id: string): Promise<Order> {
    return request<Order>(`/api/orders/${encodeURIComponent(id)}`)
  },

  update(id: string, patch: OrderPatch): Promise<Order> {
    return request<Order>(`/api/orders/${encodeURIComponent(id)}`, { method: 'PUT', body: patch })
  },
}

/* ── Coupons ───────────────────────────────────────────────────── */

const coupons = {
  list(): Promise<Coupon[]> {
    return request<Coupon[]>('/api/coupons')
  },

  /** Upsert by code (POST is idempotent server-side). */
  create(input: CouponInput): Promise<Coupon> {
    return request<Coupon>('/api/coupons', { method: 'POST', body: input })
  },

  update(code: string, patch: CouponPatch): Promise<Coupon> {
    return request<Coupon>(`/api/coupons/${encodeURIComponent(code)}`, { method: 'PUT', body: patch })
  },

  remove(code: string): Promise<{ ok: true }> {
    return request<{ ok: true }>(`/api/coupons/${encodeURIComponent(code)}`, { method: 'DELETE' })
  },
}

/* ── Daily stock ───────────────────────────────────────────────── */

const stock = {
  get(): Promise<DailyStock> {
    return request<DailyStock>('/api/stock/today')
  },

  set(availableProductIds: string[]): Promise<DailyStock> {
    return request<DailyStock>('/api/stock/today', {
      method: 'PUT',
      body: { availableProductIds },
    })
  },
}

/* ── Dashboard ─────────────────────────────────────────────────── */

const dashboard = {
  stats(): Promise<DashboardStats> {
    return request<DashboardStats>('/api/dashboard/stats')
  },
}

export const adminClient = { products, orders, coupons, stock, dashboard }
