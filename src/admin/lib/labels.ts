/**
 * Turkish display labels and option lists for admin domain enums, plus the
 * colour palette for order statuses. Centralised so every page renders the
 * same wording and tints.
 */
import type {
  BadgeKind,
  CategoryId,
  MotifKind,
  OrderStatus,
  PaymentMethod,
} from '../../types'

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  bouquet: 'Buket',
  box: 'Kutuda Çiçek',
  plant: 'Saksı Bitkileri',
  wreath: 'Çelenkler',
  weddingcar: 'Gelin Arabası',
}

export const BADGE_LABELS: Record<BadgeKind, string> = {
  holland: 'Hollanda',
  new: 'Yeni',
  fast: 'Hızlı',
  premium: 'Premium',
}

export const MOTIF_LABELS: Record<MotifKind, string> = {
  rose: 'Gül',
  tulip: 'Lale',
  peony: 'Şakayık',
  box: 'Kutu',
  wedding: 'Düğün',
  orchid: 'Orkide',
  anemone: 'Anemon',
  terrarium: 'Teraryum',
  premium: 'Premium',
}

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  card: 'Kredi Kartı',
  whatsapp: 'WhatsApp',
}

/** Per-status label + tint (text/background). Muted to fit the brand palette. */
export interface StatusMeta {
  label: string
  fg: string
  bg: string
}

export const STATUS_META: Record<OrderStatus, StatusMeta> = {
  received: { label: 'Alındı', fg: '#4B5563', bg: '#E9ECEF' },
  preparing: { label: 'Hazırlanıyor', fg: '#7A5A1E', bg: '#F3E6C8' },
  shipping: { label: 'Yolda', fg: '#2C4A5E', bg: '#D9E6EC' },
  delivered: { label: 'Teslim Edildi', fg: '#2F5A3D', bg: '#DBEADF' },
  cancelled: { label: 'İptal', fg: '#8A3B30', bg: '#F0DAD5' },
}

/** Canonical status order used by filters and pipeline columns. */
export const ORDER_STATUSES: OrderStatus[] = [
  'received',
  'preparing',
  'shipping',
  'delivered',
  'cancelled',
]

/* Option lists for <select> controls. */

export const CATEGORY_OPTIONS = (Object.keys(CATEGORY_LABELS) as CategoryId[]).map(
  (value) => ({ value, label: CATEGORY_LABELS[value] }),
)

export const BADGE_OPTIONS = (Object.keys(BADGE_LABELS) as BadgeKind[]).map(
  (value) => ({ value, label: BADGE_LABELS[value] }),
)

export const MOTIF_OPTIONS = (Object.keys(MOTIF_LABELS) as MotifKind[]).map(
  (value) => ({ value, label: MOTIF_LABELS[value] }),
)
