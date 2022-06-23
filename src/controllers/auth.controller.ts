import { Request, Response, NextFunction } from "express";
import { loginType } from "../schema/auth.schema";
import { generateAuthTokens, verifyEmailPass } from "../services/auth.service";
import log from "../utils/logger";
import refreshCookieOptions from "../utils/refreshCookieOptions";

export const loginController = async (
  req: Request<{}, {}, loginType["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const status = await verifyEmailPass(email, password);

    if (!status.valid) {
      const errorField = status.errorField;
      const errorMessage = status.errorMessage;
      return res.status(status.statusCode).json({ errorField, errorMessage });
    }

    // skipcq
    const user = status.user!; //at this point we are sure that we have a user
    const { accessToken, refreshToken } = generateAuthTokens(user.id);

    //send tokens
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    res.status(200).json({ accessToken });
  } catch (err: any) {
    log.error(err);
    return next(err);
  }
};
