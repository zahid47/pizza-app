import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { verifyToken } from "../utils/jwt";

const protect = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization)
    return res.status(401).json({ error: "unauthorized, no token provided" });
  if (!req.headers.authorization.startsWith("Bearer"))
    return res.status(401).json({ error: "unauthorized, not a Bearer token" });

  const token = req.headers.authorization.split(" ")[1];

  try {
    const access_secret: string = process.env.ACCESS_SECRET;
    const { valid, expired, payload } = verifyToken(token, access_secret);

    if (expired) return res.status(401).json({ error: "expired token" });
    if (!valid)
      return res.status(401).json({ error: "unauthorized, bad token" });

    //@ts-ignore
    const user = await User.findById(payload.aud); //we know for a fact that payload.aud exists here
    res.locals.user = user;
    next();
  } catch (err: any) {
    return res.sendStatus(401);
  }
};

export default protect;
