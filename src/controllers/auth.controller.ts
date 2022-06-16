import { Request, Response } from "express";
import User from "../models/user.model";
import { signToken } from "../utils/jwt";
import log from "../utils/logger";
import refreshCookieOptions from "../utils/refreshCookieOptions";

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body; //TODO validate this

    //validate email and pass
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ email: "Email not found" });

    // if(!user.verified) return res.status(401).json({ email: "Email not verified" });

    const isMatched = await user.comparePassword(password);
    if (!isMatched) return res.status(401).json({ password: "Invalid password" });

    //sign tokens
    const accessToken = await signToken(user.id, "ACCESS")
    const refreshToken = await signToken(user.id, "REFRESH")

    //send tokens
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    res.status(200).json({ accessToken });

  } catch (err) {
    log.error(err);
    return res.sendStatus(500);
  }
};
