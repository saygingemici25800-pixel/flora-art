import { create } from 'zustand'
import type { MotifKind, Product } from '../data/products'
import type { CategoryId, Locale, Localized } from '../types'

export interface CartItem {
  id: string
  /** Locale-resolved name at add time — legacy fallback if nameLocalized absent. */
  name: string
  /** Raw trilingual name so the cart can re-resolve live on language switch. */
  nameLocalized?: Localized
  price: number
  motif: MotifKind
  image?: string
  category: CategoryId
  quantity: number
}

/** Accepts either the flat mock Product (image) or the locale view-model (images[] + nameLocalized). */
type AddableProduct = Product & { images?: string[]; nameLocalized?: Localized }

/** Resolve a cart item's name for the given language (falls back to the frozen string). */
export function itemName(it: CartItem, lang: Locale): string {
  return it.nameLocalized?.[lang] || it.name
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: AddableProduct) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  open: () => void
  close: () => void
  toggle: () => void
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isOpen: false,
  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((it) => it.id === product.id)
      if (existing) {
        return {
          items: state.items.map((it) =>
            it.id === product.id ? { ...it, quantity: it.quantity + 1 } : it,
          ),
          isOpen: true,
        }
      }
      const image = product.images?.[0] ?? product.image
      return {
        items: [
          ...state.items,
          {
            id: product.id,
            name: product.name,
            nameLocalized: product.nameLocalized ?? {
              tr: product.name,
              en: product.name,
              ru: product.name,
            },
            price: product.price,
            motif: product.motif,
            image,
            category: product.category,
            quantity: 1,
          },
        ],
        isOpen: true,
      }
    }),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((it) => it.id !== id) })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((it) => it.id !== id)
          : state.items.map((it) => (it.id === id ? { ...it, quantity } : it)),
    })),
  clearCart: () => set({ items: [] }),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))

export function selectItemCount(state: CartState): number {
  return state.items.reduce((sum, it) => sum + it.quantity, 0)
}

export function selectSubtotal(state: CartState): number {
  return state.items.reduce((sum, it) => sum + it.price * it.quantity, 0)
}
