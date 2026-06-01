/**
 * /api/products/[id]
 *   GET    → fetch one product (public).
 *   PUT    → update a product (admin only).
 *   DELETE → remove a product (admin only).
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
import { deleteProduct, getProduct, updateProduct } from '../_lib/repo'
import { validateProductInput } from '../_lib/validation'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  const id = routeParam(req, 'id')
  if (!id) {
    sendError(res, 400, 'Missing product id')
    return
  }

  switch (req.method) {
    case 'GET': {
      const product = await getProduct(id)
      if (!product) {
        sendError(res, 404, 'Product not found')
        return
      }
      sendJson(res, 200, product)
      return
    }

    case 'PUT': {
      if (!requireAuth(req, res)) return
      // Reuse the full-input validator: updates must send a complete product.
      const result = validateProductInput(readBody(req))
      if (!result.ok) {
        sendError(res, 400, result.error)
        return
      }
      const updated = await updateProduct(id, result.value)
      if (!updated) {
        sendError(res, 404, 'Product not found')
        return
      }
      sendJson(res, 200, updated)
      return
    }

    case 'DELETE': {
      if (!requireAuth(req, res)) return
      const removed = await deleteProduct(id)
      if (!removed) {
        sendError(res, 404, 'Product not found')
        return
      }
      sendJson(res, 200, { ok: true })
      return
    }

    default:
      methodNotAllowed(res, ['GET', 'PUT', 'DELETE'])
  }
}
