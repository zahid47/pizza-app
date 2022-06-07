import { object, string } from "zod";

export const createUserSchema = object({
  body: object({
    name: string({ required_error: "name is required" }),
    email: string({ required_error: "email is required" }).email(
      "Invalid email"
    ),
    password: string({ required_error: "password is required" }),
    phone: string({ required_error: "phone is required" }),
    address: object({
      address: string({ required_error: "address line is required" }),
      city: string().optional(),
      state: string().optional(),
      zip: string().optional(),
      country: string().optional(),
      comment: string().optional(),
    }).optional(),
  }).strict(),
});

export const updateUserSchema = object({
  params: object({
    id: string({ required_error: "id is required" }),
  }),
  body: object({
    name: string().optional(),
    email: string().email("Invalid email").optional(),
    password: string().optional(),
    phone: string().optional(),
    address: object({
      address: string({ required_error: "address line is required" }),
      city: string().optional(),
      state: string().optional(),
      zip: string().optional(),
      country: string().optional(),
      comment: string().optional(),
    }).optional(),
  }).strict(),
});

export const deleteUserSchema = object({
  params: object({
    id: string({ required_error: "id is required" }),
  }),
});
