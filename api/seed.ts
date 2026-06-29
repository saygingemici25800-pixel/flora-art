/**
 * POST /api/seed
 *
 * Imports the seed catalogue (_lib/seedCatalog.ts) into KV. Two modes:
 *
 *   mode=upsert  (DEFAULT, safe)   — non-destructive. Matches each seed entry to
 *     an existing product by seedKey → slug → normalized name, PRESERVES the
 *     admin-edited fields (name, price, oldPrice, available, featured, hidden),
 *     refreshes category/motif/seedKey, fills empty image/desc/badge, creates
 *     only genuinely new entries, and NEVER deletes admin-only products.
 *     DRY-RUN BY DEFAULT — it only reports what it *would* do. To actually write
 *     you must pass `&dryRun=0` explicitly.
 *
 *   mode=replace (DESTRUCTIVE, legacy) — the old behaviour: wipes every product
 *     + the index and re-creates from scratch (new UUIDs → admin edits lost).
 *     Requires an explicit `&confirm=REPLACE_ALL` guard so it can't fire by
 *     accident.
 *
 * Auth: locally (vercel dev) it is open. In production it is gated by a secret
 * token — pass `?key=<SEED_SECRET>` or the `x-seed-key` header.
 *
 * Examples:
 *   POST /api/seed?key=...                         → upsert dry-run (no writes)
 *   POST /api/seed?key=...&mode=upsert&dryRun=0     → upsert live (safe write)
 *   POST /api/seed?key=...&mode=replace&confirm=REPLACE_ALL → destructive reset
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { methodNotAllowed, sendError, sendJsonPretty } from './_lib/http'
import { replaceAllProducts, upsertSeed } from './_lib/repo'
import { seedProducts } from './_lib/seedCatalog'

export const config = { maxDuration: 30 }

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

  const mode = req.query.mode === 'replace' ? 'replace' : 'upsert'

  try {
    if (mode === 'replace') {
      // Destructive path — only on explicit confirmation.
      if (req.query.confirm !== 'REPLACE_ALL') {
        sendJsonPretty(res, 400, {
          ok: false,
          mode: 'replace',
          error:
            'Destructive reset blocked. Re-send with &confirm=REPLACE_ALL to wipe and recreate all products (admin edits will be lost). Prefer mode=upsert.',
        })
        return
      }
      const seeded = await replaceAllProducts(seedProducts)
      sendJsonPretty(res, 201, { ok: true, mode: 'replace', seeded })
      return
    }

    // Safe upsert path. Dry-run is the DEFAULT — only `dryRun=0` actually writes.
    const dryRun = req.query.dryRun !== '0'
    const report = await upsertSeed(seedProducts, { dryRun })
    sendJsonPretty(res, dryRun ? 200 : 201, { ok: true, ...report })
  } catch (err) {
    sendJsonPretty(res, 500, {
      ok: false,
      error: err instanceof Error ? err.message : 'Seed failed',
    })
  }
}
