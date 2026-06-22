/**
 * Seed catalogue — ~100 products across the 5 storefront categories, using real
 * Fethiye-market product names, market-realistic (VAT-included) prices and warm
 * Turkish descriptions. Consumed only by POST /api/seed (it never ships in the
 * storefront bundle). Each product gets its category's webp as images[0]; Vahap
 * later replaces them one-by-one with real photos from the admin panel.
 *
 * Authored in Turkish; the trilingual structure is preserved (tr/en/ru mirror TR
 * for now) so EN/RU copy can drop in later without a schema change.
 */
import type {
  BadgeKind,
  CategoryId,
  Localized,
  MotifKind,
  ProductInput,
} from '../types'

/* Each product points at its category's shared webp until a real photo lands. */
const CATEGORY_IMAGE: Record<CategoryId, string> = {
  bouquet: '/images/categories/buket.webp',
  box: '/images/categories/kutu-cicek.webp',
  plant: '/images/categories/saksi-bitki.webp',
  wedding: '/images/categories/dugun-nisan.webp',
  corporate: '/images/categories/kurumsal.webp',
  international: '/images/categories/buket.webp',
}

/* Fallback motif when a product has no real photo (rarely seen — every seed
 * product carries a category webp). */
const CATEGORY_MOTIF: Record<CategoryId, MotifKind> = {
  bouquet: 'rose',
  box: 'box',
  plant: 'orchid',
  wedding: 'wedding',
  corporate: 'premium',
  international: 'premium',
}

function tr(value: string): Localized {
  return { tr: value, en: value, ru: value }
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/̇/g, '') // combining dot from İ → i̇
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/* ── Description generator ──────────────────────────────────────────
 * Two rotating pools (opener + closer) decorrelated by index, so adjacent
 * products read differently and exact duplicates are rare. Wedding & corporate
 * get occasion-specific closers. */
const DESC_OPEN: Array<(name: string) => string> = [
  (n) => `${n}, zarafeti ve tazeliğiyle ilk bakışta büyüler.`,
  () => `Özenle seçilmiş taze çiçeklerin uyumlu birlikteliği.`,
  (n) => `${n} ile duygularınızı en şık şekilde ifade edin.`,
  () => `Hollanda menşeli taze çiçeklerle usta ellerde hazırlanır.`,
  () => `Doğanın en canlı renklerini bir araya getiren zarif bir seçki.`,
  (n) => `İnce bir zevkin yansıması olan ${n}.`,
  () => `Her detayı düşünülmüş, premium bir çiçek kompozisyonu.`,
  () => `Tazeliği günlerce süren, göz alıcı bir aranjman.`,
  (n) => `${n}, sevdiklerinize değer verdiğinizi gösterir.`,
  () => `Mevsimin en taze çiçekleriyle titizlikle düzenlenir.`,
]

const DESC_CLOSE: string[] = [
  `Doğum günü, yıldönümü ve özel anlar için ideal.`,
  `Sevdiklerinizi şaşırtmak için mükemmel bir hediye.`,
  `Aynı gün teslimat ile kapınıza ulaşır.`,
  `Zarif ambalajıyla ilk bakışta etkiler.`,
  `Mekânınıza canlılık ve zarafet katar.`,
  `Flora Art güvencesiyle özenle hazırlanır.`,
  `İçten bir mesaj iletmenin en güzel yolu.`,
  `Uzun ömürlü tazeliğiyle keyif verir.`,
]

const WEDDING_CLOSE: string[] = [
  `En özel gününüze yakışır kusursuz bir zarafet.`,
  `Nişan ve düğün törenleriniz için özel olarak hazırlanır.`,
  `Mutluluğunuzun en güzel anına eşlik eder.`,
  `Hayalinizdeki gün için zarif bir dokunuş.`,
]

const CORPORATE_CLOSE: string[] = [
  `Açılış, tören ve kutlamalar için kurumsal bir seçim.`,
  `İş ortaklarınıza zarafetinizi yansıtır.`,
  `Ofis ve mağazalarınıza prestijli bir hava katar.`,
  `Kurumsal nezaketin zarif bir ifadesi.`,
]

function descFor(name: string, index: number, category: CategoryId): string {
  const opener = DESC_OPEN[index % DESC_OPEN.length](name)
  const closePool =
    category === 'wedding'
      ? WEDDING_CLOSE
      : category === 'corporate'
        ? CORPORATE_CLOSE
        : DESC_CLOSE
  const closer = closePool[(index * 3 + 1) % closePool.length]
  return `${opener} ${closer}`
}

/* ── Catalogue entries ─────────────────────────────────────────────── */
interface Entry {
  name: string
  price: number
  oldPrice?: number
  motif?: MotifKind
  badge?: BadgeKind
  featured?: boolean
}

const BOUQUET: Entry[] = [
  { name: "5'li Gül Buketi", price: 1250 },
  { name: "7'li Gül Buketi", price: 1500, badge: 'new' },
  { name: "11'li Gül Buketi", price: 2200, featured: true },
  { name: "21'li Gül Buketi", price: 3200 },
  { name: '41 Kırmızı Gül Buketi', price: 7500, oldPrice: 8900, badge: 'premium', featured: true },
  { name: '41 Gül Kız İsteme Buketi', price: 8500, badge: 'premium' },
  { name: '41 Kırmızı Gül Aşk Buketi', price: 7900, oldPrice: 9000, badge: 'premium' },
  { name: 'Lüks Kırmızı Gül Buketi', price: 6500, badge: 'premium', featured: true },
  { name: 'Zarif Gül Buketi', price: 1850 },
  { name: 'Nergisli Gül Buketi', price: 1650, badge: 'new' },
  { name: 'Renkli Gül Aşkı', price: 2450 },
  { name: 'Aşka Dair Gül Buketi', price: 2750, oldPrice: 3300, featured: true },
  { name: 'Güllerin Renk Aşkı', price: 2350 },
  { name: 'Kırmızı ve Beyaz Aşkı Güller', price: 2650 },
  { name: 'Pembe Gül Buketi', price: 1950 },
  { name: 'Beyaz Gül Buketi', price: 1950, badge: 'holland' },
  { name: 'Mevsim Buketi', price: 1450, badge: 'fast', featured: true },
  { name: 'Baharın Şenliği Buketi', price: 1350, badge: 'new' },
  { name: 'Bahar Buketi', price: 1250 },
  { name: 'Gerbera Buketi', price: 1550, motif: 'anemone' },
  { name: 'Pembe Gerbera Buketi', price: 1650, motif: 'anemone' },
  { name: 'Renklerin Şöleni Buketi', price: 1750, oldPrice: 2100, featured: true },
  { name: 'Papatyanın Gül Aşkı', price: 1850, motif: 'anemone' },
  { name: 'Martın Güzelliği Buketi', price: 1650 },
  { name: 'Lüks Papatya Buketi', price: 2250, motif: 'anemone', badge: 'premium' },
  { name: 'Lilyum Buketi', price: 1950 },
  { name: 'Lilyum Gül Buketi', price: 2450, featured: true },
  { name: 'Gül ve Papatya Buketi', price: 1750, motif: 'anemone' },
  { name: 'Kasımpatı Buketi', price: 1350, motif: 'anemone' },
  { name: 'Karanfil Buketi', price: 1250, oldPrice: 1500 },
  { name: 'Şakayık Buketi', price: 2950, motif: 'peony', badge: 'premium', featured: true },
  { name: 'Lale Buketi', price: 1650, motif: 'tulip', badge: 'new' },
  { name: 'Ortanca Buketi', price: 2150, motif: 'peony' },
  { name: 'Ayıcıklı Buket', price: 1850, featured: true },
  { name: 'Mevsim Demeti', price: 1150 },
]

const BOX: Entry[] = [
  { name: 'Kalp Kutuda Kırmızı Güller', price: 2450, featured: true },
  { name: 'Silindir Kutuda Güller', price: 2250 },
  { name: 'Siyah Kutuda Kırmızı Gül', price: 2950, oldPrice: 3500, badge: 'premium', featured: true },
  { name: 'Kutuda Mevsim Çiçekleri', price: 1650, badge: 'fast' },
  { name: 'Lüks Kutu Aranjman', price: 4500, badge: 'premium' },
  { name: 'Pembe Kutuda Güller', price: 2350 },
  { name: 'Beyaz Kutuda Orkide', price: 2750, motif: 'orchid', badge: 'holland' },
  { name: 'Kutuda Lilyum', price: 1950 },
  { name: 'Kutuda Papatya', price: 1450, motif: 'anemone', badge: 'new' },
  { name: 'Aşk Kutusu', price: 2650, featured: true },
  { name: 'Romantik Kutu', price: 2450, oldPrice: 2900 },
  { name: 'Premium Gül Kutusu', price: 4250, badge: 'premium', featured: true },
  { name: 'Mini Kutu Çiçek', price: 1250, badge: 'new' },
  { name: 'Çikolatalı Kutu Çiçek', price: 1850, featured: true },
  { name: 'Kutuda Karışık Güller', price: 2150 },
  { name: 'Kutuda Beyaz Güller', price: 2250 },
  { name: 'Kutuda Pembe Lilyum', price: 1950 },
  { name: 'Kalp Kutuda Karışık Güller', price: 2550, oldPrice: 3000 },
  { name: 'Altın Kutu Aranjman', price: 4750, badge: 'premium' },
  { name: 'Kutuda Mor Orkide', price: 2850, motif: 'orchid', badge: 'holland' },
  { name: 'Kutuda Şakayık', price: 3250, motif: 'peony', badge: 'premium', featured: true },
  { name: 'Lüks Kalp Kutu', price: 4950, oldPrice: 5500, badge: 'premium' },
  { name: 'Kutuda Kırmızı & Beyaz', price: 2350 },
  { name: 'Kutuda Gül ve Lilyum', price: 2450 },
  { name: 'Premium Kutu Çiçek', price: 3950, badge: 'premium' },
]

const PLANT: Entry[] = [
  { name: 'İki Dallı Mor Orkide', price: 2450, motif: 'orchid', featured: true },
  { name: 'İki Dallı Pembe Orkide', price: 2450, motif: 'orchid' },
  { name: 'Beyaz Orkide Aranjman', price: 2250, motif: 'orchid', badge: 'holland' },
  { name: 'Cam Vazoda Beyaz Orkide', price: 2650, oldPrice: 3100, motif: 'orchid', featured: true },
  { name: "2'li Orkide", price: 2350, motif: 'orchid' },
  { name: 'Tek Dal Orkide', price: 1450, motif: 'orchid', badge: 'new' },
  { name: 'Spathiphyllum (Barış Çiçeği)', price: 1250, motif: 'terrarium' },
  { name: 'Guzmania', price: 1350, motif: 'terrarium' },
  { name: 'Antoryum', price: 1550, motif: 'terrarium', featured: true },
  { name: 'Bonsai', price: 1950, motif: 'terrarium' },
  { name: 'Sukulent Aranjman', price: 1150, motif: 'terrarium', badge: 'new' },
  { name: 'Kaktüs Bahçesi', price: 1250, motif: 'terrarium' },
  { name: 'Areka Palmiyesi', price: 1850, motif: 'terrarium' },
  { name: 'Benjamin', price: 1650, motif: 'terrarium' },
  { name: 'Yucca', price: 1750, motif: 'terrarium' },
  { name: 'Lilyum Saksı', price: 1450, motif: 'terrarium' },
  { name: 'Difenbahya', price: 1550, oldPrice: 1850, motif: 'terrarium' },
  { name: 'Begonya', price: 1050, motif: 'terrarium' },
  { name: 'Üç Dallı Beyaz Orkide', price: 3000, motif: 'orchid', badge: 'premium', featured: true },
  { name: 'Mini Sukulent', price: 1000, motif: 'terrarium', badge: 'new' },
]

const WEDDING: Entry[] = [
  { name: 'Gelin Buketi', price: 3500, featured: true },
  { name: 'Gelin El Buketi', price: 3250 },
  { name: 'Söz Masası Aranjmanı', price: 4500, oldPrice: 5200, featured: true },
  { name: 'Nişan Çiçeği', price: 3850 },
  { name: 'Araba Süsleme', price: 2950 },
  { name: 'Gelin Arabası Süsü', price: 3250 },
  { name: 'Nikah Masası Çiçeği', price: 4250 },
  { name: 'Damat Yaka Çiçeği', price: 2500, badge: 'new' },
  { name: 'Söz Tepsisi', price: 3950 },
  { name: 'Nişan Yüzük Tepsisi', price: 3650, featured: true },
  { name: 'Beyaz Gül Gelin Buketi', price: 4750, oldPrice: 5500, badge: 'premium', featured: true },
  { name: 'Şakayık Gelin Buketi', price: 5500, motif: 'peony', badge: 'premium' },
]

const CORPORATE: Entry[] = [
  { name: 'Açılış Çelengi', price: 3500, featured: true },
  { name: 'Tören Çelengi', price: 3250 },
  { name: 'Ferforje Aranjman', price: 5500, oldPrice: 6500, badge: 'premium', featured: true },
  { name: 'Kurumsal Masa Çiçeği', price: 2750 },
  { name: 'Ofis Orkidesi', price: 3250, motif: 'orchid', badge: 'holland' },
  { name: 'Açılış Çiçeği', price: 3850, featured: true },
  { name: 'Kutlama Aranjmanı', price: 4250, oldPrice: 4900 },
  { name: 'Vip Kurumsal Aranjman', price: 6900, badge: 'premium', featured: true },
]

/* ── Build + dedupe ─────────────────────────────────────────────────── */
const all: ProductInput[] = []

function addCategory(category: CategoryId, entries: Entry[]): void {
  for (const e of entries) {
    const index = all.length
    all.push({
      name: tr(e.name),
      description: tr(descFor(e.name, index, category)),
      slug: slugify(e.name),
      category,
      motif: e.motif ?? CATEGORY_MOTIF[category],
      price: e.price,
      oldPrice: e.oldPrice,
      images: [CATEGORY_IMAGE[category]],
      badge: e.badge,
      available: true,
      featured: e.featured ?? false,
    })
  }
}

addCategory('bouquet', BOUQUET)
addCategory('box', BOX)
addCategory('plant', PLANT)
addCategory('wedding', WEDDING)
addCategory('corporate', CORPORATE)

// Guarantee unique slugs (names are distinct, but be defensive).
const seenSlugs = new Set<string>()
for (const p of all) {
  let slug = p.slug
  let n = 2
  while (seenSlugs.has(slug)) slug = `${p.slug}-${n++}`
  p.slug = slug
  seenSlugs.add(slug)
}

export const seedProducts: ProductInput[] = all
