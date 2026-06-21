// Single source of truth for delivery fees, shared by the Delivery page (fee
// table) and Checkout (zone selector). Place names are proper nouns
// (language-independent), so they live here rather than in i18n; only the
// labels/notes around them are translated.
//
// Example pricing — to be refined; the exact fee is confirmed over WhatsApp.

export interface DeliveryFee {
  area: string
  fee: number
}

export const FETHIYE_FEES: DeliveryFee[] = [
  { area: 'Merkez (Kesikkapı, Tuzla, Karagözler)', fee: 50 },
  { area: 'Foça', fee: 60 },
  { area: 'Taşyaka / Akarca', fee: 60 },
  { area: 'Çalış', fee: 70 },
  { area: 'Çiftlik', fee: 70 },
  { area: 'Ölüdeniz', fee: 80 },
  { area: 'Ovacık', fee: 80 },
  { area: 'Hisarönü', fee: 80 },
  { area: 'Karaçulha', fee: 90 },
]

export const MUGLA_FEES: DeliveryFee[] = [
  { area: 'Seydikemer', fee: 150 },
  { area: 'Ortaca', fee: 180 },
  { area: 'Dalaman', fee: 200 },
  { area: 'Köyceğiz', fee: 220 },
  { area: 'Ula', fee: 250 },
  { area: 'Marmaris', fee: 280 },
  { area: 'Menteşe (Muğla Merkez)', fee: 300 },
  { area: 'Yatağan', fee: 320 },
  { area: 'Kavaklıdere', fee: 340 },
  { area: 'Milas', fee: 360 },
  { area: 'Bodrum', fee: 400 },
  { area: 'Datça', fee: 400 },
]

export const ALL_DELIVERY_FEES: DeliveryFee[] = [...FETHIYE_FEES, ...MUGLA_FEES]

/** Look up a fee row by its (unique) area name. */
export function findDeliveryFee(area: string): DeliveryFee | undefined {
  return ALL_DELIVERY_FEES.find((f) => f.area === area)
}
