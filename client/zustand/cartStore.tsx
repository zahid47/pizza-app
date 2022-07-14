import create from "zustand";
import { devtools, persist } from "zustand/middleware";

// const useCartStore = create<any>(
//   devtools(
//     persist(
//       (set) => ({
//         total: 0,
//         totalqty: 0,
//         cartContent: [],
//         addToCart: (params: any) => {
//           set((state: any) => ({
//             totalqty: state.totalqty + 1,
//             total: state.total + parseFloat(params.price),
//             cartContent: [...state.cartContent, params],
//           }));
//         },
//         updateCart: ({ params, mycart }: any) => {
//           set((state: any) => ({
//             totalqty: state.totalqty + 1,
//             total: state.total + parseFloat(params.price),
//             cartContent: mycart,
//           }));
//         },
//         clearCart: () => set({ totalqty: 0, total: 0, cartContent: [] }),
//         removeFromCart: (params: any) =>
//           set((state: any) => ({
//             total: state.total - params.price * params.quantity,
//             totalqty: state.totalqty - params.quantity,
//             cartContent: state.cartContent.filter(
//               (item: any) => item.id !== params.id
//             ),
//           })),
//       }),
//       { name: "cart" }
//     )
//   )
// );

const cartStore = (set: any) => ({
  cartContent: [],
  addToCart: (product: any) =>
    set((state: any) => {
      const isPresent: boolean = state.cartContent.find(
        (p: any) => p.id === product.id
      ); // check if product is already in cart

      if (isPresent) {
        return {
          cartContent: state.cartContent.map((item: any) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        cartContent: [...state.cartContent, product],
      };
    }),

  removeFromCart: (productId: string) =>
    set((state: any) => {
      return {
        cartContent: state.cartContent.filter(
          (item: any) => item.id !== productId
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
