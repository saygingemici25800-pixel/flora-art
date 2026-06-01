/**
 * /api/stock/today
 *   GET → today's available product ids (public; the storefront filters by
 *         this). Accepts an optional ?date=YYYY-MM-DD override.
 *   PUT → set today's available product ids (admin only).
 *
 * Note: like /api/products, the read path is public so the storefront can
 * show daily availability without a session; only the write path is gated.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAuth } from '../_lib/auth'
import {
  methodNotAllowed,
  readBody,
  sendError,
  sendJson,
} from '../_lib/http'
import { getStock, setStock } from '../_lib/repo'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function resolveDate(req: VercelRequest): string | null {
  const q = req.query.date
  if (typeof q === 'string') {
    return DATE_RE.test(q) ? q : null
  }
  return new Date().toISOString().slice(0, 10)
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  const date = resolveDate(req)
  if (!date) {
    sendError(res, 400, 'date must be in YYYY-MM-DD format')
    return
  }

  switch (req.method) {
    case 'GET': {
      const stock = await getStock(date)
      sendJson(res, 200, stock)
      return
    }

    case 'PUT': {
      if (!requireAuth(req, res)) return
      const body = readBody<{ availableProductIds?: unknown }>(req)
      const ids = body?.availableProductIds
      if (
        !Array.isArray(ids) ||
        !ids.every((v) => typeof v === 'string')
      ) {
        sendError(res, 400, 'availableProductIds must be an array of strings')
        return
      }
      const saved = await setStock(date, ids as string[])
      sendJson(res, 200, saved)
      return
    }

    default:
      methodNotAllowed(res, ['GET', 'PUT'])
  }
}
