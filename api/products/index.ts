/**
 * /api/products
 *   GET  → list products (public; the storefront reads this).
 *          Optional filters: ?category=, ?featured=1, ?available=1
 *   POST → create a product (admin only).
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAuth } from '../_lib/auth'
import { methodNotAllowed, readBody, sendError, sendJson } from '../_lib/http'
import { createProduct, listProducts } from '../_lib/repo'
import { validateProductInput } from '../_lib/validation'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  switch (req.method) {
    case 'GET': {
      let products = await listProducts()
      const { category, featured, available } = req.query
      if (typeof category === 'string') {
        products = products.filter((p) => p.category === category)
      }
      if (featured === '1' || featured === 'true') {
        products = products.filter((p) => p.featured)
      }
      if (available === '1' || available === 'true') {
        products = products.filter((p) => p.available)
      }
      sendJson(res, 200, products)
      return
    }

    case 'POST': {
      if (!requireAuth(req, res)) return
      const result = validateProductInput(readBody(req))
      if (!result.ok) {
        sendError(res, 400, result.error)
        return
      }
      const created = await createProduct(result.value)
      sendJson(res, 201, created)
      return
    }

    default:
      methodNotAllowed(res, ['GET', 'POST'])
  }
}
