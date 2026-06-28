/**
 * Synthetic seed data for the admin panel (STEP 2 — UI-only, no backend).
 *
 * Mirrors the live API shapes from `src/types` so that swapping the mock
 * client (`adminClient.ts`) for real `fetch` calls in STEP 3 needs no UI
 * changes. All customers / phones / addresses below are fabricated.
 */
import type {
  Coupon,
  DailyStock,
  Order,
  OrderStatus,
  Product,
} from '../../types'

/* Relative timestamps so the dashboard "recent / time-ago" reads live. */
const HOUR = 3_600_000
const DAY = 24 * HOUR
const now = Date.now()
const ago = (ms: number) => new Date(now - ms).toISOString()
const iso = ago // alias for readability

/* ── Products ──────────────────────────────────────────────────── */

const img = (id: string) => [`/products/${id}-1.jpg`, `/products/${id}-2.jpg`]

export const seedProducts: Product[] = [
  {
    id: 'red-roses',
    name: { tr: 'Kırmızı Gül Buketi', en: 'Red Rose Bouquet', ru: 'Букет красных роз' },
    slug: 'kirmizi-gul-buketi',
    category: 'bouquet',
    price: 450,
    oldPrice: 520,
    description: {
      tr: '21 adet ithal kırmızı gülden, el yapımı buket.',
      en: 'A handmade bouquet of 21 imported red roses.',
      ru: 'Букет ручной работы из 21 импортной красной розы.',
    },
    images: img('red-roses'),
    badge: 'holland',
    motif: 'rose',
    available: true,
    featured: true,
    createdAt: iso(40 * DAY),
    updatedAt: iso(2 * DAY),
  },
  {
    id: 'holland-tulip',
    name: { tr: 'Hollanda Lalesi', en: 'Holland Tulips', ru: 'Голландские тюльпаны' },
    slug: 'hollanda-lalesi',
    category: 'bouquet',
    price: 380,
    description: {
      tr: 'Mevsimin en taze Hollanda lalelerinden hazırlanır.',
      en: 'Arranged from the freshest Holland tulips of the season.',
      ru: 'Из самых свежих голландских тюльпанов сезона.',
    },
    images: img('holland-tulip'),
    badge: 'new',
    motif: 'tulip',
    available: true,
    featured: true,
    createdAt: iso(36 * DAY),
    updatedAt: iso(5 * DAY),
  },
  {
    id: 'peony-arr',
    name: { tr: 'Peony Aranjman', en: 'Peony Arrangement', ru: 'Композиция из пионов' },
    slug: 'peony-aranjman',
    category: 'bouquet',
    price: 620,
    description: {
      tr: 'Dolgun şakayıklardan zarif bir aranjman.',
      en: 'An elegant arrangement of full peonies.',
      ru: 'Изящная композиция из пышных пионов.',
    },
    images: img('peony-arr'),
    badge: 'holland',
    motif: 'peony',
    available: true,
    featured: true,
    createdAt: iso(30 * DAY),
    updatedAt: iso(8 * DAY),
  },
  {
    id: 'box-roses',
    name: { tr: 'Kutu Güller', en: 'Roses in a Box', ru: 'Розы в коробке' },
    slug: 'kutu-guller',
    category: 'box',
    price: 550,
    description: {
      tr: 'Şık kutu içinde dizilmiş güller.',
      en: 'Roses arranged inside a stylish box.',
      ru: 'Розы в стильной коробке.',
    },
    images: img('box-roses'),
    badge: 'fast',
    motif: 'box',
    available: true,
    featured: false,
    createdAt: iso(28 * DAY),
    updatedAt: iso(28 * DAY),
  },
  {
    id: 'wedding-bq',
    name: { tr: 'Düğün Buketi', en: 'Wedding Bouquet', ru: 'Свадебный букет' },
    slug: 'dugun-buketi',
    category: 'weddingcar',
    price: 1200,
    description: {
      tr: 'Gelin için özel tasarım düğün buketi.',
      en: 'A bespoke bridal bouquet.',
      ru: 'Свадебный букет на заказ для невесты.',
    },
    images: img('wedding-bq'),
    motif: 'wedding',
    available: true,
    featured: false,
    createdAt: iso(24 * DAY),
    updatedAt: iso(10 * DAY),
  },
  {
    id: 'orchid-pot',
    name: { tr: 'Orkide', en: 'Orchid', ru: 'Орхидея' },
    slug: 'orkide',
    category: 'plant',
    price: 490,
    description: {
      tr: 'Çift dallı, saksıda phalaenopsis orkide.',
      en: 'A double-stem potted phalaenopsis orchid.',
      ru: 'Орхидея фаленопсис в горшке, два стебля.',
    },
    images: img('orchid-pot'),
    badge: 'new',
    motif: 'orchid',
    available: true,
    featured: false,
    createdAt: iso(20 * DAY),
    updatedAt: iso(20 * DAY),
  },
  {
    id: 'anemone-bq',
    name: { tr: 'Anemone Buketi', en: 'Anemone Bouquet', ru: 'Букет анемонов' },
    slug: 'anemone-buketi',
    category: 'bouquet',
    price: 520,
    description: {
      tr: 'Canlı renkleriyle anemon buketi.',
      en: 'A vivid anemone bouquet.',
      ru: 'Яркий букет из анемонов.',
    },
    images: img('anemone-bq'),
    badge: 'new',
    motif: 'anemone',
    available: false,
    featured: false,
    createdAt: iso(16 * DAY),
    updatedAt: iso(1 * DAY),
  },
  {
    id: 'office-orchid',
    name: { tr: 'Ofis Orkidesi', en: 'Office Orchid', ru: 'Офисная орхидея' },
    slug: 'ofis-orkidesi',
    category: 'wreath',
    price: 680,
    description: {
      tr: 'Kurumsal hediyeler için ideal orkide aranjmanı.',
      en: 'An orchid arrangement ideal for corporate gifts.',
      ru: 'Композиция из орхидей для корпоративных подарков.',
    },
    images: img('office-orchid'),
    badge: 'fast',
    motif: 'orchid',
    available: true,
    featured: false,
    createdAt: iso(12 * DAY),
    updatedAt: iso(3 * DAY),
  },
  {
    id: 'terrarium',
    name: { tr: 'Teraryum', en: 'Terrarium', ru: 'Террариум' },
    slug: 'teraryum',
    category: 'plant',
    price: 420,
    description: {
      tr: 'Cam fanus içinde minyatür sukulent bahçesi.',
      en: 'A miniature succulent garden under glass.',
      ru: 'Миниатюрный сад суккулентов под стеклом.',
    },
    images: img('terrarium'),
    badge: 'new',
    motif: 'terrarium',
    available: true,
    featured: false,
    createdAt: iso(8 * DAY),
    updatedAt: iso(8 * DAY),
  },
  {
    id: 'intl-premium',
    name: { tr: 'Uluslararası Premium', en: 'International Premium', ru: 'Международный премиум' },
    slug: 'uluslararasi-premium',
    category: 'bouquet',
    price: 1500,
    description: {
      tr: 'Dünya geneline 1 günde teslim premium aranjman.',
      en: 'A premium arrangement delivered worldwide in one day.',
      ru: 'Премиум-композиция с доставкой по миру за один день.',
    },
    images: img('intl-premium'),
    badge: 'premium',
    motif: 'premium',
    available: true,
    featured: true,
    createdAt: iso(6 * DAY),
    updatedAt: iso(6 * DAY),
  },
]

/* ── Orders ────────────────────────────────────────────────────── */

interface OrderSeed {
  ref: number
  createdMsAgo: number
  status: OrderStatus
  customer: Order['customer']
  region: string
  timeSlot: string
  items: Order['items']
  payment: Order['paymentMethod']
  giftNote?: string
  trackingNo?: string
  courier?: string
}

const orderSeeds: OrderSeed[] = [
  {
    ref: 1,
    createdMsAgo: 45 * 60_000,
    status: 'received',
    customer: { name: 'Elif Demir', phone: '+90 532 111 22 33', email: 'elif@example.com' },
    region: 'Fethiye Merkez',
    timeSlot: '14:00 – 16:00',
    items: [{ productId: 'red-roses', name: 'Kırmızı Gül Buketi', price: 450, quantity: 1 }],
    payment: 'card',
    giftNote: 'Doğum günün kutlu olsun!',
  },
  {
    ref: 2,
    createdMsAgo: 3 * HOUR,
    status: 'preparing',
    customer: { name: 'Mert Kaya', phone: '+90 533 222 33 44', email: 'mert@example.com' },
    region: 'Çalış',
    timeSlot: '16:00 – 18:00',
    items: [
      { productId: 'peony-arr', name: 'Peony Aranjman', price: 620, quantity: 1 },
      { productId: 'box-roses', name: 'Kutu Güller', price: 550, quantity: 1 },
    ],
    payment: 'card',
  },
  {
    ref: 3,
    createdMsAgo: 6 * HOUR,
    status: 'shipping',
    customer: { name: 'Ayşe Yıldız', phone: '+90 535 333 44 55', email: 'ayse@example.com' },
    region: 'Ölüdeniz',
    timeSlot: '10:00 – 12:00',
    items: [{ productId: 'holland-tulip', name: 'Hollanda Lalesi', price: 380, quantity: 2 }],
    payment: 'whatsapp',
    trackingNo: 'FA-TRK-3310',
    courier: 'Flora Kurye',
  },
  {
    ref: 4,
    createdMsAgo: 1 * DAY,
    status: 'delivered',
    customer: { name: 'Can Öztürk', phone: '+90 536 444 55 66', email: 'can@example.com' },
    region: 'Hisarönü',
    timeSlot: '12:00 – 14:00',
    items: [{ productId: 'wedding-bq', name: 'Düğün Buketi', price: 1200, quantity: 1 }],
    payment: 'card',
    trackingNo: 'FA-TRK-3290',
    courier: 'Flora Kurye',
  },
  {
    ref: 5,
    createdMsAgo: 1 * DAY + 4 * HOUR,
    status: 'delivered',
    customer: { name: 'Zeynep Arslan', phone: '+90 537 555 66 77', email: 'zeynep@example.com' },
    region: 'Fethiye Merkez',
    timeSlot: '18:00 – 20:00',
    items: [
      { productId: 'orchid-pot', name: 'Orkide', price: 490, quantity: 1 },
      { productId: 'terrarium', name: 'Teraryum', price: 420, quantity: 1 },
    ],
    payment: 'card',
  },
  {
    ref: 6,
    createdMsAgo: 2 * DAY,
    status: 'cancelled',
    customer: { name: 'Burak Şahin', phone: '+90 538 666 77 88', email: 'burak@example.com' },
    region: 'Çalış',
    timeSlot: '14:00 – 16:00',
    items: [{ productId: 'office-orchid', name: 'Ofis Orkidesi', price: 680, quantity: 1 }],
    payment: 'whatsapp',
  },
  {
    ref: 7,
    createdMsAgo: 2 * DAY + 7 * HOUR,
    status: 'delivered',
    customer: { name: 'Selin Aydın', phone: '+90 539 777 88 99', email: 'selin@example.com' },
    region: 'Ölüdeniz',
    timeSlot: '10:00 – 12:00',
    items: [{ productId: 'intl-premium', name: 'Uluslararası Premium', price: 1500, quantity: 1 }],
    payment: 'card',
    giftNote: 'Tebrikler!',
    trackingNo: 'FA-TRK-3201',
    courier: 'Aras Kargo',
  },
  {
    ref: 8,
    createdMsAgo: 3 * DAY,
    status: 'delivered',
    customer: { name: 'Deniz Koç', phone: '+90 530 888 99 00', email: 'deniz@example.com' },
    region: 'Hisarönü',
    timeSlot: '16:00 – 18:00',
    items: [{ productId: 'anemone-bq', name: 'Anemone Buketi', price: 520, quantity: 1 }],
    payment: 'card',
  },
  {
    ref: 9,
    createdMsAgo: 4 * DAY,
    status: 'preparing',
    customer: { name: 'Ece Polat', phone: '+90 531 999 00 11', email: 'ece@example.com' },
    region: 'Fethiye Merkez',
    timeSlot: '12:00 – 14:00',
    items: [{ productId: 'red-roses', name: 'Kırmızı Gül Buketi', price: 450, quantity: 3 }],
    payment: 'card',
  },
  {
    ref: 10,
    createdMsAgo: 5 * DAY,
    status: 'delivered',
    customer: { name: 'Kerem Acar', phone: '+90 532 101 20 30', email: 'kerem@example.com' },
    region: 'Çalış',
    timeSlot: '14:00 – 16:00',
    items: [
      { productId: 'holland-tulip', name: 'Hollanda Lalesi', price: 380, quantity: 1 },
      { productId: 'peony-arr', name: 'Peony Aranjman', price: 620, quantity: 1 },
    ],
    payment: 'whatsapp',
  },
]

const DELIVERY_FEE = 50

function buildOrder(seed: OrderSeed): Order {
  const subtotal = seed.items.reduce((s, it) => s + it.price * it.quantity, 0)
  const deliveryFee = DELIVERY_FEE
  const createdAt = ago(seed.createdMsAgo)
  // Delivery requested for the day after the order was placed.
  const deliveryDate = new Date(now - seed.createdMsAgo + DAY).toISOString().slice(0, 10)
  return {
    id: `ord_${String(seed.ref).padStart(4, '0')}`,
    orderNumber: `#FA-${String(seed.ref).padStart(4, '0')}`,
    createdAt,
    customer: seed.customer,
    items: seed.items,
    delivery: {
      region: seed.region,
      date: deliveryDate,
      timeSlot: seed.timeSlot,
      address: `${seed.region}, örnek mahalle, no 12`,
      giftNote: seed.giftNote,
    },
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    status: seed.status,
    paymentMethod: seed.payment,
    trackingNo: seed.trackingNo,
    courier: seed.courier,
  }
}

export const seedOrders: Order[] = orderSeeds
  .map(buildOrder)
  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

/* ── Coupons ───────────────────────────────────────────────────── */

export const seedCoupons: Coupon[] = [
  { code: 'HOSGELDIN10', type: 'percent', value: 10, active: true, minOrder: 300 },
  { code: 'BAHAR50', type: 'fixed', value: 50, active: true, expiresAt: ago(-20 * DAY), minOrder: 400 },
  { code: 'KIS2025', type: 'percent', value: 15, active: false, expiresAt: ago(60 * DAY) },
]

/* ── Daily stock ───────────────────────────────────────────────── */

export const seedStock: DailyStock = {
  date: new Date(now).toISOString().slice(0, 10),
  availableProductIds: seedProducts.filter((p) => p.available).map((p) => p.id),
}
