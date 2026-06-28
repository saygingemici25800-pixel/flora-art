/**
 * Minimal runtime validators for request payloads. Intentionally
 * dependency-free — just enough to reject malformed input with a clear
 * message before it reaches KV.
 */
import type {
  CategoryId,
  Coupon,
  CouponType,
  Localized,
  MotifKind,
  OrderInput,
  PaymentMethod,
  ProductInput,
} from '../../src/types'

export type Result<T> = { ok: true; value: T } | { ok: false; error: string }

const CATEGORIES: readonly CategoryId[] = [
  'bouquet',
  'box',
  'plant',
  'wreath',
  'weddingcar',
]

const MOTIFS: readonly MotifKind[] = [
  'rose',
  'tulip',
  'peony',
  'box',
  'wedding',
  'orchid',
  'anemone',
  'terrarium',
  'premium',
]

const PAYMENT_METHODS: readonly PaymentMethod[] = ['card', 'whatsapp']
const COUPON_TYPES: readonly CouponType[] = ['percent', 'fixed']

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0
}

function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v)
}

function isLocalized(v: unknown): v is Localized {
  return (
    isObject(v) &&
    isNonEmptyString(v.tr) &&
    isNonEmptyString(v.en) &&
    isNonEmptyString(v.ru)
  )
}

/* ── Product ────────────────────────────────────────────────────── */

export function validateProductInput(input: unknown): Result<ProductInput> {
  if (!isObject(input)) return { ok: false, error: 'Body must be an object' }
  if (!isLocalized(input.name))
    return { ok: false, error: 'name must have tr, en and ru strings' }
  if (!isLocalized(input.description))
    return { ok: false, error: 'description must have tr, en and ru strings' }
  if (!isNonEmptyString(input.slug))
    return { ok: false, error: 'slug is required' }
  if (!CATEGORIES.includes(input.category as CategoryId))
    return { ok: false, error: 'category is invalid' }
  if (!MOTIFS.includes(input.motif as MotifKind))
    return { ok: false, error: 'motif is invalid' }
  if (!isFiniteNumber(input.price) || input.price < 0)
    return { ok: false, error: 'price must be a non-negative number' }
  if (input.oldPrice !== undefined && !isFiniteNumber(input.oldPrice))
    return { ok: false, error: 'oldPrice must be a number' }
  if (!Array.isArray(input.images) || !input.images.every(isNonEmptyString))
    return { ok: false, error: 'images must be an array of strings' }
  if (typeof input.available !== 'boolean')
    return { ok: false, error: 'available must be a boolean' }
  if (typeof input.featured !== 'boolean')
    return { ok: false, error: 'featured must be a boolean' }

  const value: ProductInput = {
    name: input.name,
    description: input.description,
    slug: input.slug,
    category: input.category as CategoryId,
    motif: input.motif as MotifKind,
    price: input.price,
    oldPrice: input.oldPrice as number | undefined,
    images: input.images as string[],
    badge: input.badge as ProductInput['badge'],
    available: input.available,
    featured: input.featured,
    seoTitle: isNonEmptyString(input.seoTitle) ? input.seoTitle : undefined,
    seoDescription: isNonEmptyString(input.seoDescription)
      ? input.seoDescription
      : undefined,
  }
  return { ok: true, value }
}

/* ── Order ──────────────────────────────────────────────────────── */

export function validateOrderInput(input: unknown): Result<OrderInput> {
  if (!isObject(input)) return { ok: false, error: 'Body must be an object' }

  const customer = input.customer
  if (!isObject(customer) || !isNonEmptyString(customer.name)) {
    return { ok: false, error: 'customer.name is required' }
  }

  if (!Array.isArray(input.items) || input.items.length === 0) {
    return { ok: false, error: 'items must be a non-empty array' }
  }
  for (const item of input.items) {
    if (
      !isObject(item) ||
      !isNonEmptyString(item.productId) ||
      !isNonEmptyString(item.name) ||
      !isFiniteNumber(item.price) ||
      !isFiniteNumber(item.quantity) ||
      item.quantity < 1
    ) {
      return { ok: false, error: 'each item needs productId, name, price, quantity' }
    }
  }

  const delivery = input.delivery
  if (!isObject(delivery) || !isNonEmptyString(delivery.region)) {
    return { ok: false, error: 'delivery.region is required' }
  }

  if (!isFiniteNumber(input.subtotal) || input.subtotal < 0)
    return { ok: false, error: 'subtotal must be a non-negative number' }
  if (!isFiniteNumber(input.deliveryFee) || input.deliveryFee < 0)
    return { ok: false, error: 'deliveryFee must be a non-negative number' }
  if (!isFiniteNumber(input.total) || input.total < 0)
    return { ok: false, error: 'total must be a non-negative number' }
  if (!PAYMENT_METHODS.includes(input.paymentMethod as PaymentMethod))
    return { ok: false, error: 'paymentMethod must be card or whatsapp' }

  const value = {
    customer: {
      name: customer.name,
      phone: isNonEmptyString(customer.phone) ? customer.phone : '',
      email: isNonEmptyString(customer.email) ? customer.email : '',
    },
    items: input.items.map((i: Record<string, unknown>) => ({
      productId: i.productId as string,
      name: i.name as string,
      price: i.price as number,
      quantity: i.quantity as number,
    })),
    delivery: {
      region: delivery.region,
      date: isNonEmptyString(delivery.date) ? delivery.date : '',
      timeSlot: isNonEmptyString(delivery.timeSlot) ? delivery.timeSlot : '',
      address: isNonEmptyString(delivery.address) ? delivery.address : '',
      giftNote: isNonEmptyString(delivery.giftNote) ? delivery.giftNote : undefined,
      recipientName: isNonEmptyString(delivery.recipientName) ? delivery.recipientName : undefined,
      recipientPhone: isNonEmptyString(delivery.recipientPhone) ? delivery.recipientPhone : undefined,
      note: isNonEmptyString(delivery.note) ? delivery.note : undefined,
    },
    subtotal: input.subtotal,
    deliveryFee: input.deliveryFee,
    total: input.total,
    paymentMethod: input.paymentMethod as PaymentMethod,
  } satisfies OrderInput
  return { ok: true, value }
}

/* ── Coupon ─────────────────────────────────────────────────────── */

export function validateCouponInput(input: unknown): Result<Coupon> {
  if (!isObject(input)) return { ok: false, error: 'Body must be an object' }
  if (!isNonEmptyString(input.code))
    return { ok: false, error: 'code is required' }
  if (!COUPON_TYPES.includes(input.type as CouponType))
    return { ok: false, error: 'type must be percent or fixed' }
  if (!isFiniteNumber(input.value) || input.value < 0)
    return { ok: false, error: 'value must be a non-negative number' }
  if (input.type === 'percent' && input.value > 100)
    return { ok: false, error: 'percent value cannot exceed 100' }
  if (typeof input.active !== 'boolean')
    return { ok: false, error: 'active must be a boolean' }
  if (input.minOrder !== undefined && !isFiniteNumber(input.minOrder))
    return { ok: false, error: 'minOrder must be a number' }

  const value: Coupon = {
    code: input.code.trim().toUpperCase(),
    type: input.type as CouponType,
    value: input.value,
    active: input.active,
    expiresAt: isNonEmptyString(input.expiresAt) ? input.expiresAt : undefined,
    minOrder: input.minOrder as number | undefined,
  }
  return { ok: true, value }
}
