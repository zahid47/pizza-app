import create from "zustand";
import { devtools, persist } from "zustand/middleware";

const cartStore = (set: any) => ({
  cartContent: [],
  cartTotal: 0,
  setCartTotal: (cartTotal: number) =>
    set((state: any) => ({ ...state, cartTotal })),
  addToCart: (product: any) =>
    set((state: any) => {
      const isPresent: boolean = state.cartContent.find(
        (p: any) => p.id === product.id && p.option === product.option
      ); // check if product is already in cart

      if (isPresent) {
        return {
          cartContent: state.cartContent.map((item: any) =>
            item.id === product.id && item.option === product.option
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        cartContent: [...state.cartContent, product],
      };
    }),

  removeFromCart: (product: any) =>
    set((state: any) => {
      const isPresent: boolean = state.cartContent.find(
        (p: any) => p.id === product.id && p.option === product.option
      ); // check if product is already in cart
      if (isPresent) {
        return {
          cartContent: state.cartContent.map((item: any) => {
            if (
              item.id === product.id &&
              item.option === product.option &&
              item.quantity > 1
            ) {
              return { ...item, quantity: item.quantity - 1 };
            } else {
              return item;
            }
          }),
        };
      }
      return {
        cartContent: state.cartContent,
      };
    }),

  deleteFromCart: (product: any) =>
    set((state: any) => {
      return {
        cartContent: state.cartContent.filter(
          (item: any) =>
            item.id !== product.id || item.option !== product.option
        ),
      };
    }),

  clearCart: () =>
    set(() => {
      return { cartContent: [] };
    }),
});

const useCartStore = create(devtools(persist(cartStore, { name: "cart" })));

export default useCartStore;
