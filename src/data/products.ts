export type CategoryId =
  | 'bouquet'
  | 'box'
  | 'plant'
  | 'wreath'
  | 'weddingcar'

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
  // Temporary stock photo (Pexels, commercial-free). Will be replaced with
  // Vahap's real product photos. Optional + empty → the motif fallback is shown.
  // (Kept optional so the locale-resolved StoreProduct view-model, which carries
  //  `images[]` instead, stays structurally assignable to this type.)
  image?: string
}

const IMG = (slug: string) => `/images/products/${slug}.webp`

export const products: Product[] = [
  { id: 'red-roses',     name: 'Kırmızı Gül Buketi',     price: 450,  category: 'bouquet',       motif: 'rose',      badge: 'holland', image: IMG('kirmizi-gul-buketi') },
  { id: 'holland-tulip', name: 'Hollanda Lalesi',        price: 380,  category: 'bouquet',       motif: 'tulip',     badge: 'new',     image: IMG('hollanda-lalesi') },
  { id: 'peony-arr',     name: 'Peony Aranjman',         price: 620,  category: 'bouquet',       motif: 'peony',     badge: 'holland', image: IMG('peony-aranjman') },
  { id: 'box-roses',     name: 'Kutu Güller',            price: 550,  category: 'box',           motif: 'box',       badge: 'fast',    image: IMG('kutu-guller') },
  { id: 'wedding-bq',    name: 'Düğün Buketi',           price: 1200, category: 'weddingcar',    motif: 'wedding',                     image: IMG('dugun-buketi') },
  { id: 'orchid-pot',    name: 'Orkide',                 price: 490,  category: 'plant',         motif: 'orchid',    badge: 'new',     image: IMG('orkide') },
  { id: 'anemone-bq',    name: 'Anemone Buketi',         price: 520,  category: 'bouquet',       motif: 'anemone',   badge: 'new',     image: IMG('anemone-buketi') },
  { id: 'tulip-arr',     name: 'Lale Aranjman',          price: 340,  category: 'bouquet',       motif: 'tulip',                       image: IMG('lale-aranjman') },
  { id: 'engagement-fl', name: 'Nişan Çiçeği',           price: 850,  category: 'weddingcar',    motif: 'wedding',   badge: 'holland', image: IMG('nisan-cicegi') },
  { id: 'office-orchid', name: 'Ofis Orkidesi',          price: 680,  category: 'wreath',        motif: 'orchid',    badge: 'fast',    image: IMG('ofis-orkidesi') },
  { id: 'terrarium',     name: 'Teraryum',               price: 420,  category: 'plant',         motif: 'terrarium', badge: 'new',     image: IMG('teraryum') },
  { id: 'intl-premium',  name: 'Uluslararası Premium',   price: 1500, category: 'bouquet',       motif: 'premium',   badge: 'premium', image: IMG('intl-premium') },
]

export const featuredProducts: Product[] = products.slice(0, 6)
