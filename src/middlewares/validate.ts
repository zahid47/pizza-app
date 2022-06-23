import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import createError from "../utils/createError";

const validate =
  (schema: AnyZodObject) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
      // skipcq
    } catch (err) {
      if (err instanceof ZodError) {
        return next(createError(400, "validate", err.message));
      } else {
        throw err;
      }
    }
  };

export default validate;
