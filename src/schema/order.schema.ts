import { array, number, object, string, TypeOf } from "zod";

export const createOrderSchema = object({
  body: object({
    products: array(
      object({
        product: string({ required_error: "product id is required" }),
        option: string({ required_error: "product option is required" }),
        quantity: number({ required_error: "quantity is required" }),
      })
    ),
    payment: object({
      method: string().optional(),
    }),
    total: number().optional(),
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
        option: string().optional(),
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

export const validateManagePaymentStatusSchema = object({
  query: object({
    status: string({ required_error: "payment status is required" }),
    orderId: string({ required_error: "order id is required" }),
    accessToken: string({ required_error: "access token is required" }),
  }).strict(),
});

export type createOrderInput = TypeOf<typeof createOrderSchema>;
export type getOrdersInput = TypeOf<typeof getOrdersSchema>;
export type getOrderInput = TypeOf<typeof getOrderSchema>;
export type updateOrderInput = TypeOf<typeof updateOrderSchema>;
export type deleteOrderInput = TypeOf<typeof deleteOrderSchema>;
export type validateManagePaymentStatusInput = TypeOf<
  typeof validateManagePaymentStatusSchema
>;
