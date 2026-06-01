/**
 * Admin authentication: a single shared password (ADMIN_PASSWORD) exchanged
 * for a signed JWT (JWT_SECRET) delivered as an httpOnly cookie.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createHash, timingSafeEqual } from 'node:crypto'
import jwt from 'jsonwebtoken'
import { sendError } from './http'

const COOKIE_NAME = 'fa_admin'
const TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60 // 7 days

interface AdminClaims {
  role: 'admin'
}

function jwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not configured')
  return secret
}

/**
 * Constant-time password check. Both sides are SHA-256 hashed first so the
 * comparison length never leaks the real password length and never throws
 * on a length mismatch.
 */
export function verifyPassword(input: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected || typeof input !== 'string') return false
  const a = createHash('sha256').update(input).digest()
  const b = createHash('sha256').update(expected).digest()
  return timingSafeEqual(a, b)
}

export function signToken(): string {
  const claims: AdminClaims = { role: 'admin' }
  return jwt.sign(claims, jwtSecret(), { expiresIn: TOKEN_TTL_SECONDS })
}

export function setAuthCookie(res: VercelResponse, token: string): void {
  const secure = process.env.VERCEL_ENV === 'production' ? '; Secure' : ''
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${TOKEN_TTL_SECONDS}${secure}`,
  )
}

export function clearAuthCookie(res: VercelResponse): void {
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`,
  )
}

function extractToken(req: VercelRequest): string | null {
  const cookie = req.cookies?.[COOKIE_NAME]
  if (cookie) return cookie
  const auth = req.headers.authorization
  if (auth?.startsWith('Bearer ')) return auth.slice('Bearer '.length)
  return null
}

/** True when the request carries a valid admin token. */
export function isAuthenticated(req: VercelRequest): boolean {
  const token = extractToken(req)
  if (!token) return false
  try {
    const payload = jwt.verify(token, jwtSecret())
    return (
      typeof payload === 'object' &&
      payload !== null &&
      (payload as AdminClaims).role === 'admin'
    )
  } catch {
    return false
  }
}

/**
 * Guard for protected handlers. Returns true when authorized; otherwise
 * writes a 401 and returns false so the caller can `return`.
 */
export function requireAuth(req: VercelRequest, res: VercelResponse): boolean {
  if (isAuthenticated(req)) return true
  sendError(res, 401, 'Unauthorized')
  return false
}
