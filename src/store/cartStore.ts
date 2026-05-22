import { create } from 'zustand'
import type { MotifKind, Product } from '../data/products'

export interface CartItem {
  id: string
  name: string
  price: number
  motif: MotifKind
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product) => void
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
      return {
        items: [
          ...state.items,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            motif: product.motif,
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
