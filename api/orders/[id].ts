/**
 * /api/orders/[id]
 *   GET → fetch one order (used by the order-success / tracking page).
 *   PUT → update status / tracking / courier (admin only).
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
import { getOrder, updateOrder } from '../_lib/repo'
import type { OrderPatch, OrderStatus } from '../../src/types'

const STATUSES: readonly OrderStatus[] = [
  'received',
  'preparing',
  'shipping',
  'delivered',
  'cancelled',
]

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  const id = routeParam(req, 'id')
  if (!id) {
    sendError(res, 400, 'Missing order id')
    return
  }

  switch (req.method) {
    case 'GET': {
      const order = await getOrder(id)
      if (!order) {
        sendError(res, 404, 'Order not found')
        return
      }
      sendJson(res, 200, order)
      return
    }

    case 'PUT': {
      if (!requireAuth(req, res)) return
      const body = readBody<Record<string, unknown>>(req)
      if (!body) {
        sendError(res, 400, 'Body is required')
        return
      }
      if (
        body.status !== undefined &&
        !STATUSES.includes(body.status as OrderStatus)
      ) {
        sendError(res, 400, 'Invalid status')
        return
      }
      const patch: OrderPatch = {
        status: body.status as OrderStatus | undefined,
        trackingNo:
          typeof body.trackingNo === 'string' ? body.trackingNo : undefined,
        courier: typeof body.courier === 'string' ? body.courier : undefined,
      }
      const updated = await updateOrder(id, patch)
      if (!updated) {
        sendError(res, 404, 'Order not found')
        return
      }
      sendJson(res, 200, updated)
      return
    }

    default:
      methodNotAllowed(res, ['GET', 'PUT'])
  }
}
