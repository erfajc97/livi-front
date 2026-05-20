import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface ComboProduct {
  productId?: number;
  productVariationId?: number;
  quantity: number;
}

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  image: string;
  ml: number;
  price: number;
  quantity: number;
  comboId?: number;
  comboProducts?: ComboProduct[];
  bajoPedido?: boolean;
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  _hasHydrated?: boolean;

  // Computed
  total: () => number;
  itemCount: () => number;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQty: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  setDrawerOpen: (open: boolean) => void;
  setHasHydrated: (hydrated: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      _hasHydrated: false,

      total: () =>
        get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),

      itemCount: () =>
        get().items.reduce((acc, item) => acc + item.quantity, 0),

      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find((i) => i.variantId === newItem.variantId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === newItem.variantId
                  ? { ...i, quantity: i.quantity + newItem.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        }));
      },

      updateQty: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      setDrawerOpen: (open) => set({ isDrawerOpen: open }),

      setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated }),
    }),
    {
      name: 'nondecants-cart',
      storage: typeof window !== 'undefined' ? createJSONStorage(() => localStorage) : undefined,
      // Solo persistir items (no el estado del drawer)
      partialize: (state) => ({ items: state.items }),
      // Marcar como hidratado cuando se rehydrate desde localStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);
