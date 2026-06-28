/**
 * Shared domain types for Flora Art.
 *
 * Used by both the React storefront (src) and the Vercel serverless API (api).
 * Keep this file framework-agnostic — no React, no Node, no DOM imports.
 */

/* ── Localization ──────────────────────────────────────────────── */

export type Locale = 'tr' | 'en' | 'ru'

/** A string translated into every supported locale. */
export type Localized = Record<Locale, string>

/* ── Product taxonomy ──────────────────────────────────────────── */

export type CategoryId =
  | 'bouquet'
  | 'box'
  | 'plant'
  | 'wreath'
  | 'weddingcar'

export type BadgeKind = 'holland' | 'new' | 'fast' | 'premium'

export type MotifKind =
  | 'rose'
  | 'tulip'
  | 'peony'
  | 'box'
  | 'wedding'
  | 'orchid'
  | 'anemone'
  | 'terrarium'
  | 'premium'

/* ── Product ───────────────────────────────────────────────────── */

export interface Product {
  id: string
  name: Localized
  slug: string
  category: CategoryId
  price: number
  /** Strikethrough "was" price, when on sale. */
  oldPrice?: number
  description: Localized
  images: string[]
  badge?: BadgeKind
  motif: MotifKind
  /** Whether the product can currently be ordered at all. */
  available: boolean
  /** Surface on the homepage / featured rails. */
  featured: boolean
  /** Hide from every storefront list/detail without deleting (admin still sees it). */
  hidden?: boolean
  seoTitle?: string
  seoDescription?: string
  /** ISO-8601 timestamp. */
  createdAt: string
  /** ISO-8601 timestamp. */
  updatedAt: string
}

/** Shape accepted when creating a product (server fills id + timestamps). */
export type ProductInput = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>

/** Shape accepted when updating a product — every field optional. */
export type ProductPatch = Partial<ProductInput>

/* ── Order ─────────────────────────────────────────────────────── */

export interface OrderCustomer {
  name: string
  phone: string
  email: string
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
}

export interface OrderDelivery {
  region: string
  /** ISO date (YYYY-MM-DD) of requested delivery. May be empty (WhatsApp orders
   *  often leave timing to the florist). */
  date: string
  timeSlot: string
  /** Recipient address — empty when the orderer collects the order themselves. */
  address: string
  /** Card note sent with the flowers. */
  giftNote?: string
  /** Gift recipient (when ordering for someone else). */
  recipientName?: string
  recipientPhone?: string
  /** Free-form order note from the customer. */
  note?: string
}

export type OrderStatus =
  | 'received'
  | 'preparing'
  | 'shipping'
  | 'delivered'
  | 'cancelled'

export type PaymentMethod = 'card' | 'whatsapp'

export interface Order {
  id: string
  /** Human-facing reference, e.g. "#FA-0042". */
  orderNumber: string
  /** ISO-8601 timestamp. */
  createdAt: string
  customer: OrderCustomer
  items: OrderItem[]
  delivery: OrderDelivery
  subtotal: number
  deliveryFee: number
  total: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  trackingNo?: string
  courier?: string
}

/**
 * Shape accepted when a customer places an order. The server assigns
 * id, orderNumber, createdAt and the initial 'received' status.
 */
export type OrderInput = Omit<
  Order,
  'id' | 'orderNumber' | 'createdAt' | 'status'
>

/** Fields an admin may change on an existing order. */
export interface OrderPatch {
  status?: OrderStatus
  trackingNo?: string
  courier?: string
}

/* ── Daily stock ───────────────────────────────────────────────── */

export interface DailyStock {
  /** ISO date (YYYY-MM-DD). */
  date: string
  availableProductIds: string[]
}

/* ── Coupon ────────────────────────────────────────────────────── */

export type CouponType = 'percent' | 'fixed'

export interface Coupon {
  code: string
  type: CouponType
  /** Percentage (0–100) when type is 'percent', otherwise a flat amount. */
  value: number
  active: boolean
  /** ISO-8601 timestamp; absent means never expires. */
  expiresAt?: string
  /** Minimum order subtotal required to apply the coupon. */
  minOrder?: number
}

export type CouponInput = Coupon
export type CouponPatch = Partial<Omit<Coupon, 'code'>>

/* ── Dashboard ─────────────────────────────────────────────────── */

export interface TopProduct {
  productId: string
  name: string
  quantity: number
  revenue: number
}

export interface DashboardStats {
  /** Revenue from all non-cancelled orders. */
  revenue: number
  orderCount: number
  /** Count of orders per status. */
  statusBreakdown: Record<OrderStatus, number>
  topProducts: TopProduct[]
  /** Most recent orders, newest first (capped). */
  recentOrders: Order[]
}

/* ── API envelope ──────────────────────────────────────────────── */

export interface ApiError {
  error: string
}
