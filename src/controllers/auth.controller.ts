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

    const result = await verifyEmailPass(email, password);

    if (!result.valid) {
      return next(createError(result.status, result.context, result.message));
    }

    // skipcq
    const user = result.user!; //at this point we are sure that we have a user
    const { accessToken, refreshToken } = generateAuthTokens(user.id);

    //send tokens
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    res.status(200).json({ accessToken, role: user.role });
  } catch (err: any) {
    log.error(err);
    return next(err);
  }
};

export const getMeController = (
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
