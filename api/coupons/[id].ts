/**
 * /api/coupons/[id]  (admin only) — [id] is the coupon code.
 *   PUT    → update a coupon.
 *   DELETE → remove a coupon.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAuth } from '../_lib/auth'
import {
  methodNotAllowed,
  readBody,
  routeParam,
  sendError,
  sendJson,
} from '../_lib/http'
import { deleteCoupon, updateCoupon } from '../_lib/repo'
import type { CouponPatch, CouponType } from '../../src/types'

const COUPON_TYPES: readonly CouponType[] = ['percent', 'fixed']

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (!requireAuth(req, res)) return

  const code = routeParam(req, 'id')
  if (!code) {
    sendError(res, 400, 'Missing coupon code')
    return
  }

  switch (req.method) {
    case 'PUT': {
      const body = readBody<Record<string, unknown>>(req)
      if (!body) {
        sendError(res, 400, 'Body is required')
        return
      }
      if (
        body.type !== undefined &&
        !COUPON_TYPES.includes(body.type as CouponType)
      ) {
        sendError(res, 400, 'type must be percent or fixed')
        return
      }
      if (body.value !== undefined && typeof body.value !== 'number') {
        sendError(res, 400, 'value must be a number')
        return
      }
      const patch: CouponPatch = {
        type: body.type as CouponType | undefined,
        value: typeof body.value === 'number' ? body.value : undefined,
        active: typeof body.active === 'boolean' ? body.active : undefined,
        expiresAt:
          typeof body.expiresAt === 'string' ? body.expiresAt : undefined,
        minOrder:
          typeof body.minOrder === 'number' ? body.minOrder : undefined,
      }
      const updated = await updateCoupon(code.toUpperCase(), patch)
      if (!updated) {
        sendError(res, 404, 'Coupon not found')
        return
      }
      sendJson(res, 200, updated)
      return
    }

    case 'DELETE': {
      const removed = await deleteCoupon(code.toUpperCase())
      if (!removed) {
        sendError(res, 404, 'Coupon not found')
        return
      }
      sendJson(res, 200, { ok: true })
      return
    }

    default:
      methodNotAllowed(res, ['PUT', 'DELETE'])
  }
}
