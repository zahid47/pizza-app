import { object, string, TypeOf } from "zod";

export const loginSchema = object({
  body: object({
    email: string({ required_error: "email is required" }).email(
      "Invalid email"
    ),
    password: string({ required_error: "password is required" }),
  }).strict(),
});

export const refreshAccessTokenSchema = object({
  query: object({
    refreshToken: string({ required_error: "refreshToken is required" }),
  }),
});

export const resetPassSchema = object({
  params: object({
    code: string({ required_error: "code is required" }),
  }),
  body: object({
    password: string({ required_error: "new password is required" }),
  }),
});

export const sendResetPassEmailSchema = object({
  body: object({
    email: string({ required_error: "email is required" }).email(
      "Invalid email"
    ),
  }),
});

export type loginType = TypeOf<typeof loginSchema>;
export type refreshAccessTokenType = TypeOf<typeof refreshAccessTokenSchema>;
export type resetPassType = TypeOf<typeof resetPassSchema>;
export type sendResetPassEmailType = TypeOf<typeof sendResetPassEmailSchema>;
