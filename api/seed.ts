/**
 * POST /api/seed
 *
 * One-shot importer: clears the product catalogue in KV and writes the seed
 * products from _lib/seedCatalog.ts as full Product records.
 *
 * Locally (vercel dev) it is open for convenience. In production it is gated by
 * a secret token: pass it as `?key=<SEED_SECRET>` or the `x-seed-key` header.
 * The token lives in the SEED_SECRET env var (never hardcoded); if it is unset
 * or the supplied value doesn't match, the request is rejected with 403 — so
 * the endpoint stays closed to the public.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { methodNotAllowed, sendError, sendJson } from './_lib/http'
import { replaceAllProducts } from './_lib/repo'
import { seedProducts } from './_lib/seedCatalog'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    methodNotAllowed(res, ['POST'])
    return
  }

  // Production is protected by a secret token; local dev stays open.
  if (process.env.VERCEL_ENV === 'production') {
    const secret = process.env.SEED_SECRET
    const fromQuery = typeof req.query.key === 'string' ? req.query.key : undefined
    const fromHeader =
      typeof req.headers['x-seed-key'] === 'string'
        ? (req.headers['x-seed-key'] as string)
        : undefined
    const provided = fromQuery ?? fromHeader
    if (!secret || provided !== secret) {
      sendError(res, 403, 'Seeding requires a valid token')
      return
    }
  }

  // Idempotent re-seed in one batched pass (clears products + index, then writes
  // everything through a single pipeline). Orders and coupons live under separate
  // keys and are left untouched. Any failure surfaces as readable JSON instead of
  // an opaque 500 FUNCTION_INVOCATION_FAILED.
  try {
    const seeded = await replaceAllProducts(seedProducts)
    sendJson(res, 201, { ok: true, seeded })
  } catch (err) {
    sendJson(res, 500, {
      ok: false,
      error: err instanceof Error ? err.message : 'Seed failed',
    })
  }
}
