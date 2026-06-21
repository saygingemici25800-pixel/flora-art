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
  { area: 'Çiftlik', fee: 80 },
  { area: 'Ovacık', fee: 90 },
  { area: 'Hisarönü', fee: 90 },
  { area: 'Ölüdeniz', fee: 100 },
  { area: 'Karaçulha', fee: 110 },
]

export const MUGLA_FEES: DeliveryFee[] = [
  { area: 'Seydikemer', fee: 150 },
  { area: 'Ortaca', fee: 200 },
  { area: 'Dalaman', fee: 220 },
  { area: 'Köyceğiz', fee: 250 },
  { area: 'Ula', fee: 280 },
  { area: 'Marmaris', fee: 300 },
  { area: 'Menteşe (Muğla Merkez)', fee: 320 },
  { area: 'Yatağan', fee: 350 },
  { area: 'Kavaklıdere', fee: 380 },
  { area: 'Milas', fee: 400 },
  { area: 'Bodrum', fee: 450 },
  { area: 'Datça', fee: 450 },
]

export const ALL_DELIVERY_FEES: DeliveryFee[] = [...FETHIYE_FEES, ...MUGLA_FEES]

/** Look up a fee row by its (unique) area name. */
export function findDeliveryFee(area: string): DeliveryFee | undefined {
  return ALL_DELIVERY_FEES.find((f) => f.area === area)
}
