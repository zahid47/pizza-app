import { number, object, string, TypeOf } from "zod";

export const createUserSchema = object({
  body: object({
    name: string({ required_error: "name is required" }),
    email: string({ required_error: "email is required" }).email(
      "Invalid email"
    ),
    password: string({ required_error: "password is required" }),
    phone: string().optional(),
    address: object({
      addressLine: string().optional(),
      city: string().optional(),
      state: string().optional(),
      zip: string().optional(),
      country: string().optional(),
      comment: string().optional(),
    }).optional(),
  }).strict(),
});

export const getUsersSchema = object({
  query: object({
    limit: string().optional(),
    page: string().optional(),
  }),
});

export const getUserSchema = object({
  params: object({
    id: string(),
  }),
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
      addressLine: string().optional(),
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

export const sendVerificationEmailSchema = object({
  body: object({
    email: string({ required_error: "email is required" }).email(
      "Invalid email"
    ),
  }),
});

export const verifyEmailSchema = object({
  params: object({
    token: string({ required_error: "token is required" }),
  }),
});

export const sendVerificationCodeSchema = object({
  body: object({
    phone: number(),
  }),
});

export const verifyCodeSchema = object({
  params: object({
    code: string({ required_error: "code is required" }),
  }),
});

export type createUserInput = TypeOf<typeof createUserSchema>;
export type getUsersInput = TypeOf<typeof getUsersSchema>;
export type getUserInput = TypeOf<typeof getUserSchema>;
export type updateUserInput = TypeOf<typeof updateUserSchema>;
export type deleteUserInput = TypeOf<typeof deleteUserSchema>;
export type sendVerificationEmailInput = TypeOf<
  typeof sendVerificationEmailSchema
>;
export type verifyEmailInput = TypeOf<typeof verifyEmailSchema>;
export type sendVerificationPhoneInput = TypeOf<
  typeof sendVerificationCodeSchema
>;
export type verifyPhoneInput = TypeOf<typeof verifyCodeSchema>;
