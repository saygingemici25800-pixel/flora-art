/**
 * Storefront product data — live from the API (GET /api/products).
 *
 * The API returns the full domain Product (trilingual `name`/`description`).
 * The storefront works with a flat, locale-resolved view (`StoreProduct`)
 * so components keep using `product.name` as a plain string. Switching the
 * UI language re-maps the cached records without refetching.
 *
 * Graceful degradation: a failed request yields an empty list + a localized
 * error string (t('shop.loadError')) instead of crashing.
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { BadgeKind, CategoryId, Locale, MotifKind, Product } from '../types'

export interface StoreProduct {
  id: string
  slug: string
  name: string
  description: string
  price: number
  oldPrice?: number
  category: CategoryId
  motif: MotifKind
  badge?: BadgeKind
  available: boolean
  featured: boolean
  hidden?: boolean
  images: string[]
  createdAt: string
}

const LOCALES: Locale[] = ['tr', 'en', 'ru']

function normLocale(lng: string): Locale {
  const base = lng.split('-')[0] as Locale
  return LOCALES.includes(base) ? base : 'tr'
}

function toStoreProduct(p: Product, locale: Locale): StoreProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name?.[locale] ?? p.name?.tr ?? '',
    description: p.description?.[locale] ?? p.description?.tr ?? '',
    price: p.price,
    oldPrice: p.oldPrice,
    category: p.category,
    motif: p.motif,
    badge: p.badge,
    available: p.available,
    featured: p.featured,
    hidden: p.hidden,
    images: p.images,
    createdAt: p.createdAt,
  }
}

export interface ProductQuery {
  category?: CategoryId
  /** Only featured products (GET /api/products?featured=1). */
  featured?: boolean
}

interface UseProductsResult {
  products: StoreProduct[]
  loading: boolean
  error: string | null
  reload: () => void
}

export function useProducts(query: ProductQuery = {}): UseProductsResult {
  const { t, i18n } = useTranslation()
  const locale = normLocale(i18n.language)

  const [raw, setRaw] = useState<Product[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const { category, featured } = query

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    const qs = new URLSearchParams()
    if (category) qs.set('category', category)
    if (featured) qs.set('featured', '1')
    const suffix = qs.toString() ? `?${qs}` : ''

    fetch(`/api/products${suffix}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status))
        return (await res.json()) as Product[]
      })
      .then((data) => {
        if (!active) return
        setRaw(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        if (!active) return
        setRaw([]) // graceful: empty list, never crash the storefront
        setError(t('shop.loadError'))
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [category, featured, tick])

  // Hidden products are dropped here — the single storefront source — so they
  // never appear in any list/grid (Home, related, similar) and a direct
  // /product/:id for a hidden item resolves to NotFound (find → undefined).
  // Admin uses adminClient, not this hook, so it still sees hidden products.
  const products = useMemo(
    () => (raw ?? []).filter((p) => !p.hidden).map((p) => toStoreProduct(p, locale)),
    [raw, locale],
  )

  const reload = useCallback(() => setTick((n) => n + 1), [])

  return { products, loading, error, reload }
}
