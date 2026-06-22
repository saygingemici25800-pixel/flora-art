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
  { area: 'Merkez (Kesikkapı, Tuzla, Karagözler, Taşyaka, Akarca)', fee: 50 },
  { area: 'Çalış (Foça dahil)', fee: 250 },
  { area: 'Ovacık', fee: 250 },
  { area: 'Hisarönü', fee: 300 },
  { area: 'Ölüdeniz', fee: 350 },
  { area: 'Esenköy (Karaçulha dahil)', fee: 400 },
  { area: 'Çiftlik', fee: 500 },
  { area: 'Kayaköy', fee: 600 },
]

export const MUGLA_FEES: DeliveryFee[] = [
  { area: 'Seydikemer', fee: 300 },
  { area: 'Ortaca', fee: 400 },
  { area: 'Dalaman', fee: 450 },
  { area: 'Köyceğiz', fee: 500 },
  { area: 'Ula', fee: 550 },
  { area: 'Marmaris', fee: 600 },
  { area: 'Menteşe (Muğla Merkez)', fee: 650 },
  { area: 'Yatağan', fee: 700 },
  { area: 'Kavaklıdere', fee: 750 },
  { area: 'Milas', fee: 800 },
  { area: 'Bodrum', fee: 900 },
  { area: 'Datça', fee: 900 },
]

export const ALL_DELIVERY_FEES: DeliveryFee[] = [...FETHIYE_FEES, ...MUGLA_FEES]

/** Look up a fee row by its (unique) area name. */
export function findDeliveryFee(area: string): DeliveryFee | undefined {
  return ALL_DELIVERY_FEES.find((f) => f.area === area)
}
