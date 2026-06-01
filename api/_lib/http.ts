/**
 * Small HTTP helpers shared by every serverless handler.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'

export function sendJson(res: VercelResponse, status: number, data: unknown): void {
  res.status(status).json(data)
}

export function sendError(
  res: VercelResponse,
  status: number,
  message: string,
): void {
  res.status(status).json({ error: message })
}

/** Reply 405 with the correct `Allow` header. */
export function methodNotAllowed(
  res: VercelResponse,
  allowed: readonly string[],
): void {
  res.setHeader('Allow', allowed.join(', '))
  res.status(405).json({ error: 'Method Not Allowed' })
}

/** Read a `[param]` route value as a single string (Vercel may give string[]). */
export function routeParam(
  req: VercelRequest,
  name: string,
): string | undefined {
  const v = req.query[name]
  if (Array.isArray(v)) return v[0]
  return v
}

/**
 * Parse a JSON request body defensively. Vercel parses JSON bodies
 * automatically, but the body may arrive as a string (or be absent).
 */
export function readBody<T = unknown>(req: VercelRequest): T | null {
  const { body } = req
  if (body == null) return null
  if (typeof body === 'string') {
    if (body.trim() === '') return null
    try {
      return JSON.parse(body) as T
    } catch {
      return null
    }
  }
  return body as T
}
