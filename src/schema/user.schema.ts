import { object, string } from "zod";

export const createUserSchema = object({
  body: object({
    name: string({ required_error: "name is required" }),
    email: string({ required_error: "email is required" }).email(
      "Invalid email"
    ),
    password: string({ required_error: "password is required" }),
    phone: string({ required_error: "phone is required" }),
  }),
});
