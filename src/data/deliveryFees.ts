// Single source of truth for delivery fees, shared by the Delivery page (fee
// table) and Checkout (zone selector). Place names are proper nouns
// (language-independent), so they live here rather than in i18n; only the
// labels/notes around them are translated.
//
// Teslimat ücretleri KDV dahildir. Kesin ücret WhatsApp üzerinden teyit edilir.
export interface DeliveryFee {
  area: string
  fee: number
}

export const FETHIYE_FEES: DeliveryFee[] = [
  { area: 'Merkez', fee: 150 },
  { area: 'Patlangıç', fee: 200 },
  { area: 'Karaçulha', fee: 250 },
  { area: 'Çalış', fee: 300 },
  { area: 'Çatalarık', fee: 350 },
  { area: 'Karagedik', fee: 350 },
  { area: 'Aksazlar Koyu', fee: 400 },
  { area: 'Çamköy', fee: 400 },
  { area: 'Çiftlik', fee: 400 },
  { area: 'Esenköy', fee: 400 },
  { area: 'Koca Çalış', fee: 400 },
  { area: 'Hisarönü', fee: 450 },
  { area: 'Liberty Signa', fee: 500 },
  { area: 'Ovacık', fee: 500 },
  { area: 'XO Cape Arnna', fee: 500 },
  { area: 'Boncuklu Koyu', fee: 600 },
  { area: 'İnlice', fee: 600 },
  { area: 'Kargı', fee: 600 },
  { area: 'Kayaköy', fee: 600 },
  { area: 'Letonya Tatil Köyü', fee: 600 },
  { area: 'Yanıklar', fee: 600 },
  { area: 'Ölüdeniz', fee: 750 },
  { area: 'Hillside', fee: 800 },
  { area: 'Kıdrak Koyu', fee: 800 },
  { area: 'Liberty Likya', fee: 800 },
  { area: 'Yeşil Üzümlü', fee: 800 },
  { area: 'Göcek', fee: 1000 },
  { area: 'Faralya', fee: 2000 },
]

export const MUGLA_FEES: DeliveryFee[] = [
  { area: 'Ortaca', fee: 2000 },
  { area: 'Dalaman', fee: 2000 },
  { area: 'Seydikemer', fee: 2500 },
]

export const ALL_DELIVERY_FEES: DeliveryFee[] = [...FETHIYE_FEES, ...MUGLA_FEES]

/** Look up a fee row by its (unique) area name. */
export function findDeliveryFee(area: string): DeliveryFee | undefined {
  return ALL_DELIVERY_FEES.find((f) => f.area === area)
}
