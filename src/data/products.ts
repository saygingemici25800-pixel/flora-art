export type CategoryId =
  | 'bouquet'
  | 'box'
  | 'wedding'
  | 'corporate'
  | 'plant'
  | 'international'

export type BadgeKind = 'holland' | 'new' | 'fast' | 'premium'

export type MotifKind =
  | 'rose'
  | 'tulip'
  | 'peony'
  | 'box'
  | 'wedding'
  | 'orchid'
  | 'anemone'
  | 'terrarium'
  | 'premium'

export interface Product {
  id: string
  name: string
  price: number
  category: CategoryId
  motif: MotifKind
  badge?: BadgeKind
}

export const products: Product[] = [
  { id: 'red-roses',     name: 'Kırmızı Gül Buketi',     price: 450,  category: 'bouquet',       motif: 'rose',      badge: 'holland' },
  { id: 'holland-tulip', name: 'Hollanda Lalesi',        price: 380,  category: 'bouquet',       motif: 'tulip',     badge: 'new' },
  { id: 'peony-arr',     name: 'Peony Aranjman',         price: 620,  category: 'bouquet',       motif: 'peony',     badge: 'holland' },
  { id: 'box-roses',     name: 'Kutu Güller',            price: 550,  category: 'box',           motif: 'box',       badge: 'fast' },
  { id: 'wedding-bq',    name: 'Düğün Buketi',           price: 1200, category: 'wedding',       motif: 'wedding' },
  { id: 'orchid-pot',    name: 'Orkide',                 price: 490,  category: 'plant',         motif: 'orchid',    badge: 'new' },
  { id: 'anemone-bq',    name: 'Anemone Buketi',         price: 520,  category: 'bouquet',       motif: 'anemone',   badge: 'new' },
  { id: 'tulip-arr',     name: 'Lale Aranjman',          price: 340,  category: 'bouquet',       motif: 'tulip' },
  { id: 'engagement-fl', name: 'Nişan Çiçeği',           price: 850,  category: 'wedding',       motif: 'wedding',   badge: 'holland' },
  { id: 'office-orchid', name: 'Ofis Orkidesi',          price: 680,  category: 'corporate',     motif: 'orchid',    badge: 'fast' },
  { id: 'terrarium',     name: 'Teraryum',               price: 420,  category: 'plant',         motif: 'terrarium', badge: 'new' },
  { id: 'intl-premium',  name: 'Uluslararası Premium',   price: 1500, category: 'international', motif: 'premium',   badge: 'premium' },
]

export const featuredProducts: Product[] = products.slice(0, 6)
