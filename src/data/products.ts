export type CategoryId =
  | 'bouquet'
  | 'box'
  | 'wedding'
  | 'corporate'
  | 'plant'
  | 'international'

export type BadgeKind = 'holland' | 'new' | 'fast'

export type MotifKind = 'rose' | 'tulip' | 'peony' | 'box' | 'wedding' | 'orchid'

export interface Product {
  id: string
  name: string
  price: number
  category: CategoryId
  motif: MotifKind
  badge?: BadgeKind
}

export const featuredProducts: Product[] = [
  { id: 'red-roses',     name: 'Kırmızı Gül Buketi', price: 450,  category: 'bouquet', motif: 'rose',    badge: 'holland' },
  { id: 'holland-tulip', name: 'Hollanda Lalesi',    price: 380,  category: 'bouquet', motif: 'tulip',   badge: 'new' },
  { id: 'peony-arr',     name: 'Peony Aranjman',     price: 620,  category: 'bouquet', motif: 'peony',   badge: 'holland' },
  { id: 'box-roses',     name: 'Kutu Güller',        price: 550,  category: 'box',     motif: 'box',     badge: 'fast' },
  { id: 'wedding-bq',    name: 'Düğün Buketi',       price: 1200, category: 'wedding', motif: 'wedding' },
  { id: 'orchid-pot',    name: 'Orkide',             price: 490,  category: 'plant',   motif: 'orchid',  badge: 'new' },
]
