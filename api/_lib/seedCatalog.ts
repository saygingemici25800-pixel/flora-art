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
} from '../../src/types'

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
  /** Explicit photo path; falls back to the category webp when omitted. */
  image?: string
  /** Explicit Turkish description; falls back to the generated one when omitted. */
  desc?: string
  /** Hide from every storefront list/detail without deleting (defaults to visible). */
  hidden?: boolean
}

const BOUQUET: Entry[] = [
  { name: "5'li Kırmızı Gül Buketi", image: '/images/products/pexels/kirmizi-gul-buket-kurdele.webp', price: 1250, hidden: true },
  { name: "7'li Kırmızı Gül Buketi", image: '/images/products/pexels/kirmizi-gul-7.webp', price: 1500, badge: 'new', hidden: true },
  { name: "11'li Pembe Gül Buketi", image: '/images/products/pexels/pembe-gul-limonyum.webp', price: 2200, featured: true, hidden: true },
  { name: "21'li Kırmızı Gül Buketi", image: '/images/products/pexels/kirmizi-gul-21.webp', price: 3200, hidden: true },
  { name: '41 Gül Kız İsteme Buketi', image: '/images/products/pexels/kiz-isteme-41.webp', price: 8500, badge: 'premium' },
  { name: '41 Kırmızı Gül Aşk Buketi', image: '/images/products/pexels/ask-buketi-41.webp', price: 7900, oldPrice: 9000, badge: 'premium', hidden: true },
  { name: 'Lüks Kırmızı Gül Buketi', image: '/images/products/pexels/luks-kirmizi-gul-buket.webp', price: 6500, badge: 'premium', featured: true, hidden: true },
  { name: 'Papatya Buketi', image: '/images/products/pexels/beyaz-papatya-buket.webp', price: 1850 },
  { name: 'Sarı-Turuncu Gül Buketi', image: '/images/products/pexels/sari-turuncu-gul-vazo.webp', price: 1650, badge: 'new', hidden: true },
  { name: 'Renkli Spray Gül Buketi', image: '/images/products/pexels/renkli-spray-gul-mavi.webp', price: 2450, hidden: true },
  { name: 'Kırmızı-Pembe Güller', image: '/images/products/pexels/kirmizi-pembe-gul-ahsap.webp', price: 2750, oldPrice: 3300, featured: true, hidden: true },
  { name: 'Pembe-Beyaz Gül Buketi', image: '/images/products/pexels/pembe-beyaz-gul-kraft.webp', price: 2350, hidden: true },
  { name: 'Pembe Gül & Orkide Buketi', image: '/images/products/pexels/pembe-gul-orkide-buket.webp', price: 2650, hidden: true },
  { name: 'Pembe Gül Buketi', image: '/images/products/pexels/pembe-gul-buket-keten.webp', price: 1950 },
  { name: 'Beyaz Gül Buketi', image: '/images/products/pexels/beyaz-gul-vazo.webp', price: 1950, badge: 'holland', hidden: true },
  { name: 'Mevsim Buketi', image: '/images/products/pexels/mevsim-buket-yaz.webp', price: 1450, badge: 'fast', featured: true },
  { name: 'Baharın Şenliği Buketi', image: '/images/products/pexels/baharin-senligi-buket.webp', price: 1350, badge: 'new', hidden: true },
  { name: 'Bahar Aranjmanı', image: '/images/products/pexels/bahar-aranjman-karanfil.webp', price: 1250, hidden: true },
  { name: 'Gerbera & Ayıcık Buketi', image: '/images/products/pexels/gerbera-ayicik-buket.webp', price: 1550, motif: 'anemone', hidden: true },
  { name: 'Pembe Gül & Gerbera Buketi', image: '/images/products/pexels/pembe-gul-gerbera-buket.webp', price: 1650, motif: 'anemone' },
  { name: 'Renkli Karanfil Buketi', image: '/images/products/pexels/renkli-karanfil-buket.webp', price: 1750, oldPrice: 2100, featured: true, hidden: true },
  { name: 'Pembe-Somon Gül Vazo', image: '/images/products/pexels/pembe-somon-gul-vazo.webp', price: 1850, motif: 'anemone', hidden: true },
  { name: 'Pembe Aster Buketi', image: '/images/products/pexels/pembe-aster-buket.webp', price: 1650, hidden: true },
  { name: 'Lüks Papatya Buketi', image: '/images/products/pexels/luks-papatya-buket.webp', price: 2250, motif: 'anemone', badge: 'premium', hidden: true },
  { name: 'Beyaz Lilyum Aranjmanı', image: '/images/products/pexels/beyaz-lilyum-buket.webp', price: 1950, hidden: true },
  { name: 'Lilyum & Gül Buketi', image: '/images/products/pexels/lilyum-gul-buket.webp', price: 2450, featured: true },
  { name: 'Papatya & Cipso Buketi', image: '/images/products/pexels/papatya-cipso-buket.webp', price: 1750, motif: 'anemone', hidden: true },
  { name: 'Kasımpatı Buketi', image: '/images/products/pexels/kasimpati-buketi.webp', price: 1350, motif: 'anemone', hidden: true },
  { name: 'Karanfil Buketi', image: '/images/products/pexels/karanfil-buketi.webp', price: 1250, oldPrice: 1500, hidden: true },
  { name: 'Şakayık & Ranunculus Buketi', image: '/images/products/pexels/sakayik-ranunculus-buket.webp', price: 2950, motif: 'peony', badge: 'premium', featured: true, hidden: true },
  { name: 'Lale Buketi', image: '/images/products/pexels/lale-buketi.webp', price: 1650, motif: 'tulip', badge: 'new' },
  { name: 'Sümbül Aranjmanı', image: '/images/products/pexels/sumbul-aranjman.webp', price: 2150, motif: 'peony', hidden: true },
  { name: 'Ayıcıklı Gerbera Aranjmanı', image: '/images/products/pexels/ayicik-gerbera-aranjman.webp', price: 1850, featured: true, hidden: true },
  { name: 'Mevsim Demeti', image: '/images/products/pexels/mevsim-demeti.webp', price: 1150, hidden: true },
]

const BOX: Entry[] = [
  { name: 'Krem Kutuda Kırmızı Güller', image: '/images/products/pexels/krem-kutu-kirmizi-gul.webp', price: 2450, featured: true, hidden: true },
  { name: 'Mor Lisianthus & Gül Kutu', image: '/images/products/pexels/mor-lisianthus-gul-kutu.webp', price: 2250, hidden: true },
  { name: 'Siyah Kutuda Kırmızı Gül', image: '/images/products/pexels/siyah-kutu-kirmizi-gul.webp', price: 2950, oldPrice: 3500, badge: 'premium', featured: true, hidden: true },
  { name: 'Kırmızı Gül Kutu Aranjman', image: '/images/products/pexels/kirmizi-gul-kutu-aranjman.webp', price: 1650, badge: 'fast' },
  { name: 'Pembe-Mor Dahlia Kutu', image: '/images/products/pexels/pembe-mor-dahlia-kutu.webp', price: 4500, badge: 'premium', hidden: true },
  { name: 'Pembe Gül Hatbox', image: '/images/products/pexels/pembe-gul-hatbox.webp', price: 2350, hidden: true },
  { name: 'Beyaz Kutuda Orkide', price: 2750, motif: 'orchid', badge: 'holland' },
  { name: 'Sarı Gül & Lale Kutu', image: '/images/products/pexels/sari-gul-lale-kutu.webp', price: 1950, hidden: true },
  { name: 'Kutuda Papatya', price: 1450, motif: 'anemone', badge: 'new' },
  { name: 'Altın Kutuda Kırmızı Güller', image: '/images/products/pexels/altin-kutu-kirmizi-gul.webp', price: 2650, featured: true, hidden: true },
  { name: 'Kırmızı Gül & Okaliptüs Kutu', image: '/images/products/pexels/kirmizi-gul-okaliptus-kutu.webp', price: 2450, oldPrice: 2900, hidden: true },
  { name: 'Sarı-Beyaz Gül Kutu', image: '/images/products/pexels/sari-beyaz-gul-kutu.webp', price: 4250, badge: 'premium', featured: true, hidden: true },
  { name: 'Mini Kutu Çiçek', image: '/images/products/pexels/mini-kutu.webp', price: 1250, badge: 'new', hidden: true },
  { name: 'Çikolatalı Kutu Çiçek', image: '/images/products/pexels/cikolatali-kutu.webp', price: 1850, featured: true, hidden: true },
  { name: 'Somon Gül Silindir Kutu', image: '/images/products/pexels/somon-gul-silindir-kutu.webp', price: 2150, hidden: true },
  { name: 'Beyaz Gül & Lale Kutu', image: '/images/products/pexels/beyaz-gul-lale-kutu.webp', price: 2250, hidden: true },
  { name: 'Beyaz Gül Aranjman', image: '/images/products/pexels/beyaz-gul-aranjman-cam.webp', price: 1950, hidden: true },
  { name: 'Turuncu-Sarı Gül Aranjman', image: '/images/products/pexels/turuncu-sari-gul-aranjman.webp', price: 2550, oldPrice: 3000, hidden: true },
  { name: 'Altın Silindirde Kırmızı-Beyaz Gül', image: '/images/products/pexels/altin-silindir-kirmizi-beyaz-gul.webp', price: 4750, badge: 'premium', hidden: true },
  { name: 'Mor Gül Kova Aranjman', image: '/images/products/pexels/mor-gul-kova-aranjman.webp', price: 2850, motif: 'orchid', badge: 'holland', hidden: true },
  { name: 'Şampanya Gül Vazo', image: '/images/products/pexels/sampanya-gul-vazo.webp', price: 3250, motif: 'peony', badge: 'premium', featured: true, hidden: true },
  { name: 'Lüks Gül Kutusu', image: '/images/products/pexels/luks-gul-kutusu.webp', price: 4950, oldPrice: 5500, badge: 'premium', hidden: true },
  { name: 'Kutuda Kırmızı & Beyaz', price: 2350 },
  { name: 'Kutuda Gül ve Lilyum', price: 2450 },
  { name: 'Renkli Bahçe Silindir Kutu', image: '/images/products/pexels/renkli-bahce-silindir-kutu.webp', price: 3950, badge: 'premium', hidden: true },
]

const PLANT: Entry[] = [
  { name: 'İki Dallı Mor Orkide', price: 2450, motif: 'orchid', featured: true, hidden: true },
  { name: 'Benekli Orkide Saksı', image: '/images/products/pexels/benekli-orkide-saksi.webp', price: 2450, motif: 'orchid', hidden: true },
  { name: 'Beyaz Orkide (Pencere)', image: '/images/products/pexels/beyaz-orkide-pencere.webp', price: 2250, motif: 'orchid', badge: 'holland', hidden: true },
  { name: 'Beyaz Orkide (Seramik)', image: '/images/products/pexels/beyaz-orkide-seramik.webp', price: 2650, oldPrice: 3100, motif: 'orchid', featured: true, hidden: true },
  { name: 'Pembe Calla (Bahçe)', image: '/images/products/pexels/pembe-calla-bahce.webp', price: 2350, motif: 'orchid', hidden: true },
  { name: 'Pembe Calla Saksı', image: '/images/products/pexels/pembe-calla-saksi.webp', price: 1450, motif: 'orchid', badge: 'new', hidden: true },
  { name: 'Spathiphyllum (Barış Çiçeği)', price: 1250, motif: 'terrarium', hidden: true },
  { name: 'Turuncu Bromelia', image: '/images/products/pexels/turuncu-bromelia.webp', price: 1350, motif: 'terrarium', hidden: true },
  { name: 'Antoryum', image: '/images/products/pexels/antoryum.webp', price: 1550, motif: 'terrarium', featured: true, hidden: true },
  { name: 'Ficus Bonsai', image: '/images/products/pexels/ficus-bonsai.webp', price: 1950, motif: 'terrarium', hidden: true },
  { name: 'Sukulent Aranjman', price: 1150, motif: 'terrarium', badge: 'new', hidden: true },
  { name: 'Kaktüs Bahçesi', image: '/images/products/pexels/kaktus-bahcesi.webp', price: 1250, motif: 'terrarium', hidden: true },
  { name: 'Areka Palmiyesi', image: '/images/products/pexels/areka-palmiyesi.webp', price: 1850, motif: 'terrarium', hidden: true },
  { name: 'Pilea (Para Bitkisi)', image: '/images/products/pexels/pilea-para-bitkisi.webp', price: 1650, motif: 'terrarium', hidden: true },
  { name: 'Yucca', price: 1750, motif: 'terrarium', hidden: true },
  { name: 'Lilyum Dal Saksı', image: '/images/products/pexels/lilyum-dal-saksi.webp', price: 1450, motif: 'terrarium', hidden: true },
  { name: 'Difenbahya', image: '/images/products/pexels/difenbahya.webp', price: 1550, oldPrice: 1850, motif: 'terrarium', hidden: true },
  { name: 'Sardunya', image: '/images/products/pexels/sardunya.webp', price: 1050, motif: 'terrarium', hidden: true },
  { name: 'Üç Dallı Beyaz Orkide', image: '/images/products/pexels/uc-dalli-beyaz-orkide.webp', price: 3000, motif: 'orchid', badge: 'premium', featured: true, hidden: true },
  { name: 'Mini Sukulent', price: 1000, motif: 'terrarium', badge: 'new' },
]

const WEDDING: Entry[] = [
  { name: 'Beyaz Lilyum Gelin Buketi', image: '/images/products/pexels/beyaz-lilyum-gelin-buket.webp', price: 3500, featured: true, hidden: true },
  { name: 'Beyaz Gül Gelin Buketi', image: '/images/products/pexels/beyaz-gul-gelin-buket.webp', price: 3250, hidden: true },
  { name: 'Söz Masası Aranjmanı', image: '/images/products/pexels/soz-masasi.webp', price: 4500, oldPrice: 5200, featured: true, hidden: true },
  { name: 'Pembe Lilyum & Gül Nişan Buketi', image: '/images/products/pexels/pembe-lilyum-gul-nisan.webp', price: 3850, hidden: true },
  { name: 'Araba Süsleme', image: '/images/products/pexels/araba-susleme.webp', price: 2950, hidden: true },
  { name: 'Gelin Arabası Süsü', image: '/images/products/pexels/gelin-arabasi.webp', price: 3250, hidden: true },
  { name: 'Pembe Lilyum & Orkide Buketi', image: '/images/products/pexels/pembe-lilyum-orkide-buket.webp', price: 4250, hidden: true },
  { name: 'Damat Yaka Çiçeği', price: 2500, badge: 'new' },
  { name: 'Söz Tepsisi', price: 3950 },
  { name: 'Nişan Yüzük Tepsisi', image: '/images/products/pexels/nisan-yuzuk-tepsisi.webp', price: 3650, featured: true, hidden: true },
  { name: 'Beyaz Lilyum & Gül Buketi', image: '/images/products/pexels/beyaz-lilyum-gul-buket.webp', price: 4750, oldPrice: 5500, badge: 'premium', featured: true, hidden: true },
  { name: 'Şakayık Gelin Buketi', image: '/images/products/pexels/sakayik-gelin-buketi.webp', price: 5500, motif: 'peony', badge: 'premium', hidden: true },
]

const CORPORATE: Entry[] = [
  { name: 'Açılış Çelengi', price: 3500, featured: true },
  { name: 'Tören Çelengi', price: 3250 },
  { name: 'Ferforje Aranjman', image: '/images/products/pexels/ferforje.webp', price: 5500, oldPrice: 6500, badge: 'premium', featured: true, hidden: true },
  { name: 'Kurumsal Masa Çiçeği', image: '/images/products/pexels/kurumsal-masa.webp', price: 2750, hidden: true },
  { name: 'Ofis Orkidesi', image: '/images/products/pexels/ofis-orkidesi.webp', price: 3250, motif: 'orchid', badge: 'holland', hidden: true },
  { name: 'Açılış Çiçeği', image: '/images/products/pexels/acilis-cicegi.webp', price: 3850, featured: true, hidden: true },
  { name: 'Kutlama Aranjmanı', image: '/images/products/pexels/kutlama-aranjmani.webp', price: 4250, oldPrice: 4900, hidden: true },
  { name: 'Vip Kurumsal Aranjman', price: 6900, badge: 'premium', featured: true },
]

/* ── Batch 2 — real product photos (img_01…img_39) + written descriptions ── */
const BATCH2_PLANT: Entry[] = [
  {
    name: 'Kırmızı Antoryum Saksı',
    price: 1450,
    motif: 'terrarium',
    image: '/images/products/batch-2/img_01.webp',
    desc: 'Canlı kırmızı brakteleriyle göz dolduran antoryum, uzun ömürlü bir saksı bitkisidir. Şık kırmızı saksısı ve özenli ambalajıyla her mekâna sıcaklık katar. Hem hediye hem iç mekân dekoru için ideal.',
  },
  {
    name: 'Benjamin Ağacı (Ficus)',
    price: 2400,
    motif: 'terrarium',
    image: '/images/products/batch-2/img_02.webp',
    desc: 'Gür yapraklı, boylu Benjamin ağacı; ofis ve geniş salonlar için kalıcı bir yeşillik armağanı. Kraft kâğıt sarımı ve zarif kurdele detayıyla sunulur. Bakımı kolay, etkisi uzun soluklu bir hediye.',
  },
  {
    name: 'Mini Antoryum Saksı',
    price: 1100,
    motif: 'terrarium',
    image: '/images/products/batch-2/img_03.webp',
    desc: 'Parlak yapraklarıyla şirin bir mini antoryum aranjmanı. Kompakt boyutuyla masa ve çalışma alanları için birebir. Sevdiklerinize sade ve zarif bir jest.',
  },
  {
    name: 'Barış Çiçeği (Spatifilyum)',
    price: 1350,
    motif: 'terrarium',
    image: '/images/products/batch-2/img_04.webp',
    desc: 'Zarif beyaz çiçekleri ve koyu yeşil yapraklarıyla huzur veren spatifilyum saksısı. Hava temizleyici özelliğiyle bilinen bu bitki her ortama dinginlik taşır. Yeni iş yeri ve ev hediyesi için mükemmel.',
  },
  {
    name: 'Pembe Lilyum Saksı',
    price: 1650,
    motif: 'terrarium',
    image: '/images/products/batch-2/img_19.webp',
    desc: 'Açan ve gonca pembe lilyumlarıyla zarif, kokulu bir saksı aranjmanı. Kraft sarımı, kurutulmuş portakal ve nazar detaylarıyla sunulur. Doğum günü ve özel günler için sıcak bir seçim.', hidden: true },
  {
    name: 'Kırmızı Guzmania Saksı',
    price: 1300,
    motif: 'terrarium',
    image: '/images/products/batch-2/img_20.webp',
    desc: 'Çarpıcı kırmızı brakteli guzmania, uzun ömürlü ve bakımı kolay bir tropik bitki. Kırmızı ambalaj ve kurutulmuş portakal detayıyla hediyeye dönüşür. Mekânlara egzotik bir dokunuş.',
  },
]

const BATCH2_BOUQUET: Entry[] = [
  {
    name: 'Beyaz Papatya Buketi',
    price: 1250,
    motif: 'anemone',
    image: '/images/products/batch-2/img_05.webp',
    desc: 'Bembeyaz papatyalardan oluşan masmasum ve sıcacık bir buket. Pembe ambalajı içinde sadeliğin en güzel halini sunar. Sevgi, dostluk ve içten dileklerin çiçeği.',
  },
  {
    name: '41 Kırmızı Gül Buketi',
    price: 4900,
    badge: 'premium',
    featured: true,
    image: '/images/products/batch-2/img_06.webp',
    desc: 'Görkemli kırmızı güllerden hazırlanan, aşkın en iddialı ifadesi. Şık kırmızı ambalaj ve gazete dokulu detaylarla sunulan özel bir buket. Unutulmaz anlar için tasarlandı.',
  },
  {
    name: 'Çuval Sarımlı Kırmızı Gül',
    price: 3800,
    featured: true,
    image: '/images/products/batch-2/img_08.webp',
    desc: 'Kırmızı güller ve cipsofilya, rustik çuval ambalajla buluştu. Doğal ve sıcak duruşuyla farklı bir zarafet sunar. Hem romantik hem nostaljik bir armağan.',
  },
  {
    name: 'Sarı Lale Buketi',
    price: 1450,
    motif: 'tulip',
    image: '/images/products/batch-2/img_21.webp',
    desc: 'Capcanlı sarı laleler, cipsofilya ve zarif gazete ambalajla buluştu. Baharın enerjisini ve neşesini taşıyan ışıltılı bir buket. Sevdiklerinize güneş gibi bir sürpriz.',
  },
  {
    name: 'Kırmızı Gül & Lilyum Buketi',
    price: 1850,
    image: '/images/products/batch-2/img_22.webp',
    desc: 'Kırmızı güller ve beyaz lilyumun zarif uyumu, palmiye yeşillikleriyle taçlandı. Tutku ve saflığın bir arada sunulduğu dengeli bir buket. Özel anlar için sıcak bir tercih.',
  },
  {
    name: 'Rengârenk Gerbera Buketi',
    price: 1550,
    motif: 'anemone',
    image: '/images/products/batch-2/img_23.webp',
    desc: 'Pembe gerbera, beyaz krizantem ve limonyum çiçeklerinden oluşan ferah bir buket. Kraft kâğıt sarımıyla doğal ve sıcak bir görünüm sunar. Mutlu günleri kutlamanın renkli yolu.',
  },
  {
    name: '101 Gül Buketi',
    price: 8500,
    badge: 'premium',
    featured: true,
    image: '/images/products/batch-2/img_24.webp',
    desc: 'Yüz bir adet görkemli kırmızı gül, cipsofilya ve rustik çuval ambalajla hazırlanan ihtişamlı bir aşk armağanı. Evlilik teklifleri, dönüm noktaları ve en büyük jestler için. Sevginizin sınır tanımadığını anlatın.',
  },
  {
    name: 'Beyaz Lilyum Buketi',
    price: 1950,
    image: '/images/products/batch-2/img_25.webp',
    desc: 'Açan ve gonca beyaz lilyumlardan oluşan, tüllü beyaz ambalajıyla zarif bir buket. Saflığın ve asaletin çiçeği, kokusuyla da büyüler. Nikâh, kutlama ve özel günler için.',
  },
  {
    name: 'Okaliptüslü Kırmızı Gül Buketi',
    price: 2950,
    featured: true,
    image: '/images/products/batch-2/img_26.webp',
    desc: 'Yoğun kırmızı güller, okaliptüs ve cipsofilya ile rustik çuval ambalajda buluştu. Doğal dokusu ve zengin yapısıyla göz dolduran bir buket. Romantik ve etkileyici bir hediye.',
  },
  {
    name: 'Tropik Pembe Karışık Buket',
    price: 2450,
    image: '/images/products/batch-2/img_28.webp',
    desc: 'Pembe güller, gerberalar, laleler ve palmiye yapraklarıyla zengin, tropik bir buket. Canlı renkleri ve dolgun yapısıyla nefes kesen bir sunum. Şıklığı sevenler için özel.',
  },
  {
    name: 'Mor & Pembe Mevsim Buketi',
    price: 2250,
    image: '/images/products/batch-2/img_29.webp',
    desc: 'Lila güller, mor krizantem, alstroemeria ve gerberalardan oluşan romantik bir buket. Pembe ambalajı içinde zarif ve dolgun bir görünüm sunar. Sevdiklerinize ince bir jest.',
  },
  {
    name: 'Kırmızı Gül & Papatya Buketi',
    price: 1650,
    image: '/images/products/batch-2/img_30.webp',
    desc: 'Kırmızı güller, bembeyaz papatyalarla çevrelendi; şık siyah ambalajla taçlandı. Tutku ve sadeliğin zarif buluşması. Hem romantik hem modern bir armağan.',
  },
  {
    name: 'Beyaz Lilyum & Lisyantus Buketi',
    price: 2350,
    image: '/images/products/batch-2/img_31.webp',
    desc: 'Beyaz lilyum, lisyantus ve cipsofilyanın masum uyumu, nazar detaylı zarif ambalajla sunuldu. Saflığın ve zarafetin en güzel hali. Yeni başlangıçlar ve özel dilekler için.',
  },
  {
    name: 'Kırmızı Gül & Beyaz Lilyum Buketi',
    price: 2150,
    image: '/images/products/batch-2/img_32.webp',
    desc: 'Kırmızı güller, beyaz lilyum ve bordo astilbe ile zengin bir kontrast oluşturan buket. Şık siyah ambalajıyla iddialı ve romantik bir duruş sunar. Anlam yüklü anlar için.',
  },
  {
    name: '35 Kırmızı Gül Buketi',
    price: 4200,
    badge: 'premium',
    image: '/images/products/batch-2/img_33.webp',
    desc: 'Dolgun kırmızı güllerden hazırlanan, şık siyah ambalajlı gösterişli bir buket. Aşkın klasik ve güçlü ifadesi. Sevdiğinizi etkilemek için kusursuz bir seçim.',
  },
  {
    name: 'Seni Seviyorum Gül Buketi',
    price: 2650,
    featured: true,
    image: '/images/products/batch-2/img_34.webp',
    desc: "Kırmızı güller, okaliptüs ve 'Seni Seviyorum' kartıyla romantik bir gazete sarımlı buket. Nazar boncuğu detayıyla sevgi ve koruma dolu bir armağan. Aşkınızı yüksek sesle söyleyin.",
  },
  {
    name: '51 Kırmızı Gül Buketi',
    price: 5500,
    badge: 'premium',
    image: '/images/products/batch-2/img_35.webp',
    desc: 'Bol ve görkemli kırmızı güllerden oluşan, şık siyah ambalajlı iddialı bir buket. Büyük aşkların ve özel kutlamaların çiçeği. Unutulmaz bir jest arayanlara.',
  },
  {
    name: 'Beyaz Gül Görkemi',
    price: 6500,
    badge: 'premium',
    featured: true,
    image: '/images/products/batch-2/img_36.webp',
    desc: 'Yoğun beyaz güller, okaliptüs ve yeşilliklerle hazırlanan ihtişamlı bir buket. Saflığın ve zarafetin en büyük ifadesi. Nikâh, yıldönümü ve görkemli anlar için.',
  },
  {
    name: 'Gazete Sarımlı Kırmızı Gül',
    price: 2750,
    image: '/images/products/batch-2/img_37.webp',
    desc: 'Bordo-kırmızı güller, okaliptüs ve yeşilliklerle rustik gazete kağıdına sarıldı. Nostaljik ve zarif duruşuyla farklı bir romantizm sunar. Modern ve klasiği sevenlere.',
  },
]

const BATCH2_BOX: Entry[] = [
  {
    name: 'Annelere Özel Kutu & Balon',
    price: 2950,
    featured: true,
    image: '/images/products/batch-2/img_07.webp',
    desc: 'Rengârenk lilyum, gül ve kır çiçeklerinden oluşan zengin aranjman; kalpli folyo balon eşliğinde. Anneler Günü ve özel kutlamalar için hazırlanmış doyurucu bir kutu. Sevgiyi büyük göstermek isteyenlere.',
  },
  {
    name: 'Ayıcıklı Papatya Sepeti',
    price: 1300,
    motif: 'anemone',
    image: '/images/products/batch-2/img_09.webp',
    desc: 'Beyaz papatyalar, peluş ayıcık ve okaliptüs yapraklarıyla sevimli bir hasır sepet aranjmanı. Doğum günü ve sürpriz hediyeler için tatlı bir seçenek. Küçük ama unutulmaz bir jest.',
  },
  {
    name: 'Silindir Kutuda Papatyalar',
    price: 1450,
    motif: 'anemone',
    image: '/images/products/batch-2/img_16.webp',
    desc: "Bol beyaz papatya, siyah silindir kutuda rafya ve organze kurdele detayıyla buluştu. Hem sade hem modern duruşuyla her ortama yakışır. İçten bir 'seni düşünüyorum' mesajı.",
  },
  {
    name: 'Tek Güllü Papatya Kutusu',
    price: 1550,
    motif: 'anemone',
    image: '/images/products/batch-2/img_17.webp',
    desc: 'Beyaz papatyaların merkezine yerleştirilen tek bir kırmızı gülle anlam yüklü bir kutu aranjman. Sadelik ve tutkunun zarif buluşması. Özel birine ince bir mesaj.',
  },
  {
    name: 'Rengârenk Mevsim Kutusu',
    price: 1850,
    image: '/images/products/batch-2/img_18.webp',
    desc: 'Gül, gerbera, papatya ve mevsim çiçeklerinin rengârenk dansı; beyaz silindir kutuda. Neşe ve enerji dolu bu aranjman her kutlamaya canlılık katar. Renkleri sevenler için.',
  },
  {
    name: 'Cam Fanusta Papatyalar',
    price: 1350,
    motif: 'anemone',
    image: '/images/products/batch-2/img_27.webp',
    desc: 'Bembeyaz papatyalar, şık cam fanus içinde beyaz ve sarı kurdele detaylarıyla sunuldu. Masaüstü için zarif ve sade bir aranjman. İçten dileklerin tatlı bir ifadesi.',
  },
]

const BATCH2_CORPORATE: Entry[] = [
  {
    name: 'Açılış Çelengi (Kırmızı-Beyaz Gerbera)',
    price: 3200,
    featured: true,
    image: '/images/products/batch-2/img_10.webp',
    desc: 'Kırmızı ve beyaz gerberalardan hazırlanan klasik açılış çelengi. İş yeri açılışları, törenler ve kutlamalar için şık ve dikkat çekici. Kurumsal mesajınızı zarafetle iletir.',
  },
  {
    name: 'Beyaz Karanfil Açılış Çelengi',
    price: 2900,
    image: '/images/products/batch-2/img_11.webp',
    desc: 'Yoğun beyaz karanfil dokusu ve kırmızı çerçevesiyle gösterişli bir açılış çelengi. Tüllü tabanı ve dengeli yapısıyla her açılışta öne çıkar. Kurumsal incelik arayanlar için.',
  },
  {
    name: 'Çift Katlı Gerbera Çelenk',
    price: 4200,
    featured: true,
    image: '/images/products/batch-2/img_13.webp',
    desc: 'Bol kırmızı gerbera ve beyaz lilyum vurgusuyla iki katlı, ihtişamlı bir çelenk. Büyük açılış ve törenlerde fark yaratacak boyutta. Güçlü bir kurumsal duruş için.',
  },
]

const BATCH2_WEDDING: Entry[] = [
  {
    name: 'Kırmızı Gül Nişan Çelengi',
    price: 3500,
    image: '/images/products/batch-2/img_12.webp',
    desc: 'Yoğun kırmızı güllerden oluşan boylu nişan ve düğün çelengi. Kırmızı tül kurdelesiyle törenlere coşku katar. Mutlu günlerin vazgeçilmez sembolü.',
  },
  {
    name: 'Beyaz Gelin Arabası Süslemesi (Lilyum)',
    price: 2800,
    featured: true,
    image: '/images/products/batch-2/img_14.webp',
    desc: 'Beyaz lilyum, gladyol ve palmiye yapraklarıyla hazırlanan zarif gelin arabası süslemesi. Kaput ve yan aynalar için uyumlu parçalarıyla bütünlük sunar. Düğün gününe asalet katar.',
  },
  {
    name: 'Klasik Gelin Arabası Süsü',
    price: 3100,
    image: '/images/products/batch-2/img_15.webp',
    desc: 'Beyaz lilyum ve lisyantuslardan oluşan, kaput üzeri merkez aranjmanı ve yan detaylarıyla tam takım gelin arabası süslemesi. Sade ve şık bir gelinlik beyazı temasında. Hayalinizdeki düğün için.',
  },
  {
    name: 'Beyaz Gelin Arabası Süsü (Mercedes)',
    price: 3200,
    image: '/images/products/batch-2/img_38.webp',
    desc: 'Beyaz lilyum, gerbera ve okaliptüsten oluşan, kaput üzeri uzun aranjmanı ve yan ayna detaylarıyla tam takım gelin arabası süslemesi. Zarif gelinlik beyazı temasında. Düğün gününe asalet katar.',
  },
  {
    name: 'Beyaz Lisyantus Gelin Arabası Süsü',
    price: 3400,
    image: '/images/products/batch-2/img_39.webp',
    desc: 'Bol beyaz lisyantus, gül ve yeşilliklerle hazırlanan iki yan aranjmanlı şık gelin arabası süslemesi. Sade ve modern duruşuyla her araca yakışır. Hayalinizdeki düğün için ideal.',
  },
]

/* ── Build + dedupe ─────────────────────────────────────────────────── */
const all: ProductInput[] = []

function addCategory(category: CategoryId, entries: Entry[]): void {
  for (const e of entries) {
    const index = all.length
    all.push({
      name: tr(e.name),
      description: tr(e.desc ?? descFor(e.name, index, category)),
      slug: slugify(e.name),
      category,
      motif: e.motif ?? CATEGORY_MOTIF[category],
      price: e.price,
      oldPrice: e.oldPrice,
      images: [e.image ?? CATEGORY_IMAGE[category]],
      badge: e.badge,
      available: true,
      featured: e.featured ?? false,
      hidden: e.hidden ?? false,
    })
  }
}

addCategory('bouquet', BOUQUET)
addCategory('box', BOX)
addCategory('plant', PLANT)
addCategory('wedding', WEDDING)
addCategory('corporate', CORPORATE)

// Batch 2 — real product photos appended at the end of each category.
addCategory('plant', BATCH2_PLANT)
addCategory('bouquet', BATCH2_BOUQUET)
addCategory('box', BATCH2_BOX)
addCategory('corporate', BATCH2_CORPORATE)
addCategory('wedding', BATCH2_WEDDING)

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
