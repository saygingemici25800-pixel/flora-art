/**
 * /api/orders
 *   GET  → list all orders, newest first (admin only).
 *   POST → place a new order (public; the checkout flow calls this).
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAuth } from '../_lib/auth'
import { methodNotAllowed, readBody, sendError, sendJson } from '../_lib/http'
import { createOrder, listOrders } from '../_lib/repo'
import { validateOrderInput } from '../_lib/validation'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  switch (req.method) {
    case 'GET': {
      if (!requireAuth(req, res)) return
      const orders = await listOrders()
      sendJson(res, 200, orders)
      return
    }

    case 'POST': {
      const result = validateOrderInput(readBody(req))
      if (!result.ok) {
        sendError(res, 400, result.error)
        return
      }
      const created = await createOrder(result.value)
      sendJson(res, 201, created)
      return
    }

    default:
      methodNotAllowed(res, ['GET', 'POST'])
  }
}
