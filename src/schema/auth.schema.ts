import { object, string, TypeOf } from "zod";

export const loginSchema = object({
  body: object({
    email: string({ required_error: "email is required" }).email(
      "Invalid email"
    ),
    password: string({ required_error: "password is required" }),
  }).strict(),
});

export type loginType = TypeOf<typeof loginSchema>;