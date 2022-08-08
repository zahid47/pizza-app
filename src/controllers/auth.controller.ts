import { Request, Response, NextFunction } from "express";
import { omit } from "lodash";
import {
  loginType,
  refreshAccessTokenType,
  resetPassType,
  sendResetPassEmailType,
} from "../schema/auth.schema";
import { generateAuthTokens, verifyEmailPass } from "../services/auth.service";
import {
  findAndUpdateUser,
  findUserByEmail,
  findUserById,
} from "../services/user.service";
import createError from "../utils/createError";
import { verifyToken } from "../utils/jwt";
import log from "../utils/logger";
import refreshCookieOptions from "../utils/refreshCookieOptions";
import argon2 from "argon2";
import { sendEmail } from "../utils/sendEmail";

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
    const { accessToken, refreshToken } = generateAuthTokens(
      user.id,
      user.role
    );

    //send tokens
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    res.status(200).json({ accessToken });
    // res.json({accessToken, refreshToken});
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

export const refreshAccessTokenController = (
  req: Request<{}, {}, {}, refreshAccessTokenType["query"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    // const refToken = req.cookies.refreshToken; // FIXME
    const refToken = req.query.refreshToken;
    const secret = process.env.REFRESH_SECRET;
    try {
      const { valid, expired, payload } = verifyToken(refToken, secret);

      if (expired) return next(createError(401, "jwt", "refreshToken expired"));
      if (!valid) return next(createError(401, "jwt", "refreshToken invalid"));

      //@ts-ignore
      const userId = payload.aud;
      //@ts-ignore
      const role = payload.role;
      const { accessToken, refreshToken } = generateAuthTokens(userId, role);

      //send tokens
      res.cookie("refreshToken", refreshToken, refreshCookieOptions);
      res.status(200).json({ accessToken, role });

      // skipcq
    } catch (err: any) {
      return next(createError(401, "refresh access token", err.message));
    }
  } catch (err: any) {
    log.error(err);
    return next(createError(err.status, "refresh access token", err.message));
  }
};

export const resetPassController = async (
  req: Request<resetPassType["params"], {}, resetPassType["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const secret = process.env.TOKEN_SECRET;
    const token = req.params.code;

    const { valid, expired, payload } = verifyToken(token, secret);
    if (!valid) return next(createError(401, "jwt", "token invalid"));
    if (expired) return next(createError(401, "jwt", "token expired"));

    // @ts-ignore
    const userId = payload.aud;
    const user = await findUserById(userId);

    if (!user) return next(createError(404, "user", "user not found"));

    const newPassword = req.body.password;
    const newHashedPassword = await argon2.hash(newPassword);
    await findAndUpdateUser(userId, { password: newHashedPassword });

    return res.sendStatus(200);
  } catch (err: any) {
    log.error(err);
    return next(createError(err.status, "reset password", err.message));
  }
};

export const sendResetPassEmailController = async (
  req: Request<{}, {}, sendResetPassEmailType["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findUserByEmail(req.body.email);

    if (!user) return next(createError(404, "user", "user not found"));

    if (process.env.NODE_ENV !== "test") {
      //all good, lets send the forgot pass email now
      sendEmail(user.id, user.email, "RESET");
    }
    return res.sendStatus(200);
  } catch (err: any) {
    log.error(err);
    return next(createError(err.status, "send reset pass email", err.message));
  }
};
