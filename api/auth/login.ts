/**
 * POST /api/auth/login
 * Body: { password: string }
 * On success sets an httpOnly admin cookie and returns { ok: true }.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  signToken,
  setAuthCookie,
  verifyPassword,
} from '../_lib/auth'
import { methodNotAllowed, readBody, sendError, sendJson } from '../_lib/http'

export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (req.method !== 'POST') {
    methodNotAllowed(res, ['POST'])
    return
  }

  const body = readBody<{ password?: unknown }>(req)
  if (!verifyPassword(body?.password)) {
    // Generic message — don't reveal whether the password merely had wrong length.
    sendError(res, 401, 'Invalid credentials')
    return
  }

  const token = signToken()
  setAuthCookie(res, token)
  sendJson(res, 200, { ok: true })
}
