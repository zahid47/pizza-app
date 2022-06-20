import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { loginType } from "../schema/auth.schema";
import { signToken } from "../utils/jwt";
import log from "../utils/logger";
import refreshCookieOptions from "../utils/refreshCookieOptions";

export const loginController = async (
  req: Request<{}, {}, loginType["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    //validate email and pass
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ email: "Email not found" });

    // if(!user.verified) return res.status(401).json({ email: "Email not verified" });

    const isMatched = await user.comparePassword(password);
    if (!isMatched)
      return res.status(401).json({ password: "Invalid password" });

    //sign tokens
    const access_secret = process.env.ACCESS_SECRET;
    const refresh_secret = process.env.REFRESH_SECRET;
    const access_expiry = process.env.ACCESS_TTL;
    const refresh_expiry = process.env.REFRESH_TTL;

    const accessToken = signToken(user.id, access_secret, access_expiry);
    const refreshToken = signToken(user.id, refresh_secret, refresh_expiry);

    //send tokens
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    res.status(200).json({ accessToken });
  } catch (err: any) {
    log.error(err);
    return next(err);
  }
};
