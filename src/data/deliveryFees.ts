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
  { area: 'Patlangıç', fee: 150 },
  { area: 'Çalış', fee: 200 },
  { area: 'Çamköy', fee: 250 },
  { area: 'Çatalarık', fee: 250 },
  { area: 'Esenköy', fee: 250 },
  { area: 'Karaçulha', fee: 250 },
  { area: 'Koca Çalış', fee: 300 },
  { area: 'XO Cape Arnna', fee: 300 },
  { area: 'Aksazlar Koyu', fee: 350 },
  { area: 'Çiftlik', fee: 350 },
  { area: 'Karagedik', fee: 350 },
  { area: 'Liberty Signa', fee: 350 },
  { area: 'Yanıklar', fee: 350 },
  { area: 'Hisarönü', fee: 400 },
  { area: 'Kargı', fee: 400 },
  { area: 'Ovacık', fee: 400 },
  { area: 'İnlice', fee: 450 },
  { area: 'Ölüdeniz', fee: 500 },
  { area: 'Kayaköy', fee: 600 },
  { area: 'Kıdrak Koyu', fee: 700 },
  { area: 'Yeşil Üzümlü', fee: 750 },
  { area: 'Göcek', fee: 800 },
  { area: 'Hillside', fee: 800 },
  { area: 'Faralya', fee: 1500 },
]

export const MUGLA_FEES: DeliveryFee[] = [
  { area: 'Seydikemer', fee: 400 },
  { area: 'Ortaca', fee: 800 },
  { area: 'Dalaman', fee: 850 },
]

export const ALL_DELIVERY_FEES: DeliveryFee[] = [...FETHIYE_FEES, ...MUGLA_FEES]

/** Look up a fee row by its (unique) area name. */
export function findDeliveryFee(area: string): DeliveryFee | undefined {
  return ALL_DELIVERY_FEES.find((f) => f.area === area)
}
