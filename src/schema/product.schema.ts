import { array, boolean, number, object, string, TypeOf } from "zod";

export const createProductSchema = object({
  body: object({
    name: string({ required_error: "product name is required" }),
    slug: string().optional(),
    description: string().optional(),
    image: array(string().url("Image must be an URL")).optional(),
    ingredients: array(string()).optional(),
    category: string().optional(),
    isVegan: boolean().optional(),
    optionsAvailable: array(string()).optional(),
    prices: array(
      object(
        {
          price: number({ required_error: "price value is required" }),
          option: string({ required_error: "option text is required" }),
        },
        { required_error: "price information is required" }
      )
    ),
    extraIngredients: array(
      object({
        name: string({ required_error: "ingredient name is required" }),
        price: string({ required_error: "ingredient price is required" }),
      })
    ).optional(),
    tags: array(string()).optional(),
  }).strict(),
});

export const getProductsSchema = object({
  query: object({
    limit: string().optional(),
    page: string().optional(),
    searchTerm: string().optional(),
    isVegan: boolean().optional(),
    minPrice: number().optional(),
    maxPrice: number().optional(),
    category: string().optional(),
  }),
}).strict();

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
    slug: string().optional(),
    description: string().optional(),
    image: array(string().url("Image must be an URL")).optional(),
    ingredients: array(string()).optional(),
    category: string().optional(),
    isVegan: boolean().optional(),
    optionsAvailable: array(string()).optional(),
    prices: array(
      object({
        price: number({ required_error: "price value is required" }),
        option: string({ required_error: "option text is required" }),
      })
    ).optional(),
    extraIngredients: object({
      name: string({ required_error: "ingredient name is required" }),
      price: string({ required_error: "ingredient price is required" }),
    }).optional(),
    tags: array(string()).optional(),
  }).strict(),
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
