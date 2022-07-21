import { array, number, object, string, TypeOf } from "zod";
import { orderedProductsType } from "../types/order.type";

export const createOrderSchema = object({
  body: object({
    products: array(
      object({
        product: string({ required_error: "product id is required" }),
        variant: string({ required_error: "product variant is required" }),
        quantity: number({ required_error: "quantity is required" }),
      })
    ),
    payment: object({
      method: string().optional(),
    }),
    total: number({ required_error: "total is required" }),
  }).strict(),
});

export const getOrdersSchema = object({
  query: object({
    limit: string().optional(),
    page: string().optional(),
  }),
});

export const getOrderSchema = object({
  params: object({
    id: string(),
  }),
});

export const updateOrderSchema = object({
  params: object({
    id: string(),
  }),
  body: object({
    products: array(
      object({
        product: string().optional(),
        variant: string().optional(),
        quantity: string().optional(),
      })
    ).optional(),
    payment: object({
      method: string().optional(),
    }).optional(),
    status: string().optional(),
  }).strict(),
});

export const deleteOrderSchema = object({
  params: object({
    id: string({ required_error: "id is required" }),
  }),
});

export const createPaymentIntentSchema = object({
  body: object({
    total: number({ required_error: "total price is required" }),
    products: array(
      object({
        product: string(),
        variant: string(),
        quantity: number(),
      })
    ),
  }),
});

export type createOrderInput = TypeOf<typeof createOrderSchema>;
export type getOrdersInput = TypeOf<typeof getOrdersSchema>;
export type getOrderInput = TypeOf<typeof getOrderSchema>;
export type updateOrderInput = TypeOf<typeof updateOrderSchema>;
export type deleteOrderInput = TypeOf<typeof deleteOrderSchema>;
export type createPaymentIntentType = TypeOf<typeof createPaymentIntentSchema>;
