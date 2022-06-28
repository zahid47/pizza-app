import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import createError from "../utils/createError";
import { verifyToken } from "../utils/jwt";

const protect = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization)
    return next(
      createError(
        401,
        "jwt",
        JSON.stringify({ details: "unauthorized, no token provided" })
      )
    );
  if (!req.headers.authorization.startsWith("Bearer"))
    return next(
      createError(
        401,
        "jwt",
        JSON.stringify({ details: "unauthorized, not a Bearer token" })
      )
    );

  const token = req.headers.authorization.split(" ")[1];

  try {
    const access_secret: string = process.env.ACCESS_SECRET;
    const { valid, expired, payload } = verifyToken(token, access_secret);

    if (!valid)
      return next(
        createError(
          401,
          "jwt",
          JSON.stringify({ details: "unauthorized, bad token" })
        )
      );

    if (expired)
      return next(
        createError(401, "jwt", JSON.stringify({ details: "token expired" }))
      );

    //@ts-ignore
    const user = await User.findById(payload.aud); //we know for a fact that payload.aud exists here
    res.locals.user = user;
    next();
  } catch (err: any) {
    return next(createError(401, "jwt", err.message));
  }
};

export default protect;
