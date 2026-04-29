import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'sonner';
import { jsx } from 'react/jsx-runtime';

const useCartStore = create()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      _hasHydrated: false,
      total: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
      itemCount: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find((i) => i.variantId === newItem.variantId);
          if (existing) {
            return {
              items: state.items.map(
                (i) => i.variantId === newItem.variantId ? { ...i, quantity: i.quantity + newItem.quantity } : i
              )
            };
          }
          return { items: [...state.items, newItem] };
        });
      },
      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId)
        }));
      },
      updateQty: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set((state) => ({
          items: state.items.map(
            (i) => i.variantId === variantId ? { ...i, quantity } : i
          )
        }));
      },
      clearCart: () => set({ items: [] }),
      setDrawerOpen: (open) => set({ isDrawerOpen: open }),
      setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated })
    }),
    {
      name: "nondecants-cart",
      storage: typeof window !== "undefined" ? createJSONStorage(() => localStorage) : void 0,
      // Solo persistir items (no el estado del drawer)
      partialize: (state) => ({ items: state.items }),
      // Marcar como hidratado cuando se rehydrate desde localStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      }
    }
  )
);

const sonnerResponse = (message, type) => {
  const opts = { duration: 3e3, position: "top-right" };
  switch (type) {
    case "success":
      toast.success(message, opts);
      break;
    case "error":
      toast.error(message, opts);
      break;
    case "loading":
      toast.loading(message, { ...opts, duration: 2e3 });
      break;
  }
};

function Loader({ size = 35, color = "#000", className = "" }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className,
      style: {
        width: size,
        aspectRatio: 1,
        background: `
          no-repeat radial-gradient(farthest-side, ${color} 94%, transparent) 0 0,
          no-repeat radial-gradient(farthest-side, ${color} 94%, transparent) 100% 0,
          no-repeat radial-gradient(farthest-side, ${color} 94%, transparent) 100% 100%,
          no-repeat radial-gradient(farthest-side, ${color} 94%, transparent) 0 100%
        `,
        backgroundSize: "40% 40%",
        animation: "loader-spin .5s infinite"
      }
    }
  );
}

export { Loader as L, sonnerResponse as s, useCartStore as u };
