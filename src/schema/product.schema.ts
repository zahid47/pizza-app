import { array, boolean, number, object, string, TypeOf } from "zod";

export const createProductSchema = object({
  body: object({
    name: string({ required_error: "product name is required" }),
    description: string().optional(),
    // images: string().url("Image must be an URL").optional(),
    ingredients: string().optional(),
    category: string().optional(),
    isVegan: string().optional(),
    prices: string(), // it is a JSON.stringify string of the prices object
    // prices: array(
    //   object(
    //     {
    //       price: number({ required_error: "price value is required" }),
    //       option: string({ required_error: "option text is required" }),
    //     },
    //     { required_error: "price information is required" }
    //   )
    // ),
    extraIngredients: array(
      object({
        name: string({ required_error: "ingredient name is required" }),
        price: number({ required_error: "ingredient price is required" }),
      })
    ).optional(),
    tags: string().optional(),
  }),
});

export const getProductsSchema = object({
  query: object({
    limit: string().optional(),
    page: string().optional(),
    searchTerm: string().optional(),
    isVegan: boolean().optional(),
    category: string().optional(),
  }),
});

export const getProductSchema = object({
  params: object({
    id: string(),
  }),
});

export const updateProductSchema = object({
  params: object({
    id: string({ required_error: "product id is required" }),
  }),
  body: object({
    name: string().optional(),
    description: string().optional(),
    // images: string().url("Image must be an URL").optional(),
    ingredients: string().optional(),
    category: string().optional(),
    isVegan: string().optional(),
    prices: string().optional(),
    // prices: array(
    //   object({
    //     price: number({ required_error: "price value is required" }),
    //     option: string({ required_error: "option text is required" }),
    //   })
    // ).optional(),
    extraIngredients: array(
      object({
        name: string({ required_error: "ingredient name is required" }),
        price: number({ required_error: "ingredient price is required" }),
      })
    ).optional(),
    tags: string().optional(),
  }),
});

export const deleteProductSchema = object({
  params: object({
    id: string({ required_error: "product id is required" }),
  }),
});

export type createProductInput = TypeOf<typeof createProductSchema>;
export type getProductsInput = TypeOf<typeof getProductsSchema>;
export type getProductInput = TypeOf<typeof getProductSchema>;
export type updateProductInput = TypeOf<typeof updateProductSchema>;
export type deleteProductInput = TypeOf<typeof deleteProductSchema>;
