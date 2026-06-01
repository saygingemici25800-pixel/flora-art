/**
 * GET /api/dashboard/stats  (admin only)
 * Aggregates orders into revenue, counts, status breakdown, best sellers
 * and a recent-orders preview.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAuth } from '../_lib/auth'
import { methodNotAllowed, sendJson } from '../_lib/http'
import { listOrders } from '../_lib/repo'
import type {
  DashboardStats,
  OrderStatus,
  TopProduct,
} from '../../src/types'

const RECENT_LIMIT = 10
const TOP_LIMIT = 5

function emptyBreakdown(): Record<OrderStatus, number> {
  return {
    received: 0,
    preparing: 0,
    shipping: 0,
    delivered: 0,
    cancelled: 0,
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== 'GET') {
    methodNotAllowed(res, ['GET'])
    return
  }
  if (!requireAuth(req, res)) return

  const orders = await listOrders() // already sorted newest-first

  const statusBreakdown = emptyBreakdown()
  const topMap = new Map<string, TopProduct>()
  let revenue = 0

  for (const order of orders) {
    statusBreakdown[order.status] += 1
    if (order.status === 'cancelled') continue

    revenue += order.total
    for (const item of order.items) {
      const current = topMap.get(item.productId) ?? {
        productId: item.productId,
        name: item.name,
        quantity: 0,
        revenue: 0,
      }
      current.quantity += item.quantity
      current.revenue += item.price * item.quantity
      topMap.set(item.productId, current)
    }
  }

  const topProducts = [...topMap.values()]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, TOP_LIMIT)

  const stats: DashboardStats = {
    revenue,
    orderCount: orders.length,
    statusBreakdown,
    topProducts,
    recentOrders: orders.slice(0, RECENT_LIMIT),
  }
  sendJson(res, 200, stats)
}
