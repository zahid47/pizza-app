import { array, boolean, number, object, string } from "zod";

export const createProductSchema = object({
  body: object({
    name: string({ required_error: "product name is required" }),
    description: string().optional(),
    image: string().url("Image must be an URL").optional(),
    ingredients: array(string()).optional(),
    category: string().optional(),
    type: string().optional(),
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
    extraIngredients: object({
      name: string({ required_error: "ingredient name is required" }),
      price: string({ required_error: "ingredient price is required" }),
    }).optional(),
    tags: array(string()).optional(),
  }).strict(),
});

export const updateProductSchema = object({
  params: object({
    id: string({ required_error: "product id is required" }),
  }),
  body: object({
    name: string().optional(),
    description: string().optional(),
    image: string().url("Image must be an URL").optional(),
    ingredients: array(string()).optional(),
    category: string().optional(),
    type: string().optional(),
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
