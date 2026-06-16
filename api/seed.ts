/**
 * POST /api/seed  (development only)
 *
 * One-shot importer: writes the 12 mock products from src/data/products.ts
 * into KV as full Product records. Disabled in production.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { methodNotAllowed, sendError, sendJson } from './_lib/http'
import { createProduct, listProducts, deleteProduct } from './_lib/repo'
import { products, featuredProducts } from '../src/data/products'
import type { Locale, ProductInput } from '../src/types'

function localized(value: string): Record<Locale, string> {
  // Mock data is Turkish-only; mirror it across locales as a starting point.
  return { tr: value, en: value, ru: value }
}

function describe(name: string): Record<Locale, string> {
  return {
    tr: `${name} — Flora Art özenle hazırlanmış taze çiçek aranjmanı.`,
    en: `${name} — a fresh floral arrangement, crafted with care by Flora Art.`,
    ru: `${name} — свежая цветочная композиция, бережно собранная Flora Art.`,
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (process.env.VERCEL_ENV === 'production') {
    sendError(res, 403, 'Seeding is disabled in production')
    return
  }
  if (req.method !== 'POST') {
    methodNotAllowed(res, ['POST'])
    return
  }

  // Idempotent re-seed: clear the existing product catalogue first so running
  // this again refreshes images instead of creating duplicates. Orders and
  // coupons live under separate keys and are left untouched.
  const existing = await listProducts()
  for (const p of existing) {
    await deleteProduct(p.id)
  }

  const featuredIds = new Set(featuredProducts.map((p) => p.id))

  let count = 0
  for (const p of products) {
    const input: ProductInput = {
      name: localized(p.name),
      description: describe(p.name),
      slug: p.id,
      category: p.category,
      motif: p.motif,
      price: p.price,
      images: p.image ? [p.image] : [],
      badge: p.badge,
      available: true,
      featured: featuredIds.has(p.id),
    }
    await createProduct(input)
    count += 1
  }

  sendJson(res, 201, { ok: true, seeded: count })
}
