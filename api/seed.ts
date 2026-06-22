/**
 * POST /api/seed  (development only)
 *
 * One-shot importer: clears the product catalogue in KV and writes the ~100
 * seed products from src/data/seedCatalog.ts as full Product records.
 * Disabled in production.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { methodNotAllowed, sendError, sendJson } from './_lib/http'
import { createProduct, listProducts, deleteProduct } from './_lib/repo'
import { seedProducts } from '../src/data/seedCatalog'

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

  let count = 0
  for (const input of seedProducts) {
    await createProduct(input)
    count += 1
  }

  sendJson(res, 201, { ok: true, seeded: count })
}
