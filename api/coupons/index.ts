/**
 * /api/coupons  (admin only)
 *   GET  → list coupons.
 *   POST → create / upsert a coupon.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAuth } from '../_lib/auth'
import { methodNotAllowed, readBody, sendError, sendJson } from '../_lib/http'
import { listCoupons, saveCoupon } from '../_lib/repo'
import { validateCouponInput } from '../_lib/validation'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (!requireAuth(req, res)) return

  switch (req.method) {
    case 'GET': {
      const coupons = await listCoupons()
      sendJson(res, 200, coupons)
      return
    }

    case 'POST': {
      const result = validateCouponInput(readBody(req))
      if (!result.ok) {
        sendError(res, 400, result.error)
        return
      }
      const saved = await saveCoupon(result.value)
      sendJson(res, 201, saved)
      return
    }

    default:
      methodNotAllowed(res, ['GET', 'POST'])
  }
}
