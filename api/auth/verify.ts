/**
 * GET  /api/auth/verify  → { authenticated: boolean }
 * POST /api/auth/logout-style clear is handled here too via ?logout=1.
 *
 * Used by the admin UI to check session validity (middleware-style guard).
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { clearAuthCookie, isAuthenticated } from '../_lib/auth'
import { methodNotAllowed, sendJson } from '../_lib/http'

export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (req.method === 'POST' && req.query.logout !== undefined) {
    clearAuthCookie(res)
    sendJson(res, 200, { ok: true })
    return
  }

  if (req.method !== 'GET') {
    methodNotAllowed(res, ['GET'])
    return
  }

  sendJson(res, 200, { authenticated: isAuthenticated(req) })
}
