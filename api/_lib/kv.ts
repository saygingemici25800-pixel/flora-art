/**
 * Vercel KV (Upstash Redis) client + key conventions.
 *
 * `@vercel/kv` reads KV_REST_API_URL and KV_REST_API_TOKEN from the
 * environment and transparently JSON-serializes values on set / parses
 * on get. Files prefixed with "_" are ignored by Vercel's filesystem
 * router, so this never becomes a route.
 */
import { kv } from '@vercel/kv'

export { kv }

/** Canonical KV key builders — the single source of truth for the schema. */
export const keys = {
  product: (id: string) => `product:${id}`,
  productsAll: 'products:all',

  order: (id: string) => `order:${id}`,
  ordersAll: 'orders:all',
  ordersCounter: 'orders:counter',

  coupon: (code: string) => `coupon:${code}`,
  couponsAll: 'coupons:all',

  stock: (date: string) => `stock:${date}`,
} as const
