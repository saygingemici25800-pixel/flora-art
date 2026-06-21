/**
 * POST /api/upload  (admin only)
 *
 * Receives a (client-resized) image as base64 in a JSON body, uploads it to
 * Vercel Blob and returns the public URL. The admin product form writes that
 * URL into the product's `images`, so the photo then shows everywhere the
 * storefront reads `images[0]` (home grid, cart, checkout, product page).
 *
 * Base64-in-JSON is used rather than a raw binary body because Vercel parses
 * JSON bodies reliably across runtime versions; the client downsizes the image
 * to ~1200px WebP first, so the payload stays small (well under the limit).
 */
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { put } from '@vercel/blob'
import { requireAuth } from './_lib/auth'
import { methodNotAllowed, readBody, sendError, sendJson } from './_lib/http'

const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

// content-type → file extension. Only real images are accepted.
const ALLOWED: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

interface UploadBody {
  data?: string // base64 (no data: prefix)
  contentType?: string
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    methodNotAllowed(res, ['POST'])
    return
  }
  // Admin-only: same JWT cookie guard as the rest of the admin API.
  if (!requireAuth(req, res)) return

  const parsed = readBody<UploadBody>(req)
  const contentType = parsed?.contentType
  const data = parsed?.data
  if (!data || typeof data !== 'string' || !contentType) {
    sendError(res, 400, 'Geçersiz istek: resim verisi eksik.')
    return
  }

  const ext = ALLOWED[contentType]
  if (!ext) {
    sendError(res, 415, 'Yalnızca JPG, PNG veya WEBP resim yüklenebilir.')
    return
  }

  let buffer: Buffer
  try {
    buffer = Buffer.from(data, 'base64')
  } catch {
    sendError(res, 400, 'Resim çözümlenemedi.')
    return
  }
  if (buffer.length === 0) {
    sendError(res, 400, 'Boş dosya.')
    return
  }
  if (buffer.length > MAX_BYTES) {
    sendError(res, 413, 'Dosya çok büyük (en fazla 5MB).')
    return
  }

  try {
    const blob = await put(`products/foto.${ext}`, buffer, {
      access: 'public',
      contentType,
      addRandomSuffix: true,
    })
    sendJson(res, 201, { url: blob.url })
  } catch (err) {
    sendError(
      res,
      500,
      err instanceof Error ? err.message : 'Yükleme başarısız oldu.',
    )
  }
}
