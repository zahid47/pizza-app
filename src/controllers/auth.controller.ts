import { Request, Response, NextFunction } from "express";
import { omit } from "lodash";
import { loginType } from "../schema/auth.schema";
import { generateAuthTokens, verifyEmailPass } from "../services/auth.service";
import createError from "../utils/createError";
import log from "../utils/logger";
import refreshCookieOptions from "../utils/refreshCookieOptions";

export const loginController = async (
  req: Request<{}, {}, loginType["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const verify = await verifyEmailPass(email, password);

    if (!verify.valid) {
      return next(createError(verify.status, verify.context, verify.message));
    }

    // skipcq
    const user = verify.user!; //at this point we are sure that we have a user
    const { accessToken, refreshToken } = generateAuthTokens(user.id);

    //send tokens
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    res.status(200).json({ accessToken });
  } catch (err: any) {
    log.error(err);
    return next(err);
  }
};

export const getMeController = async (
  _req: Request<{}, {}, loginType["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.status(200).json(omit(res.locals.user.toJSON(), "password"));
  } catch (err: any) {
    log.error(err);
    return next(err);
  }
};
