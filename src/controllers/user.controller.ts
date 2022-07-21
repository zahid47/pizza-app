import { Request, Response, NextFunction } from "express";
import { omit } from "lodash";
import {
  createUserInput,
  deleteUserInput,
  getUserInput,
  getUsersInput,
  updateUserInput,
} from "../schema/user.schema";
import {
  createUser,
  findUserById,
  findUserByEmail,
  findUsers,
  findAndUpdateUser,
  findAndDeleteUser,
} from "../services/user.service";
import createError from "../utils/createError";
import log from "../utils/logger";
import { sendEmail } from "../utils/sendEmail";

export const createUserController = async (
  req: Request<{}, {}, createUserInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const isDuplicateEmail = await findUserByEmail(req.body.email);
    if (isDuplicateEmail)
      return next(createError(409, "email", "email already exists"));

    const user = await createUser(req.body);
    // await sendEmail(user.id, user.email, "VERIFY");
    return res.status(201).json(omit(user.toJSON(), "password"));
  } catch (err: any) {
    log.error(err);
    return next(createError(err.status, "user", err.message));
  }
};

export const getUserController = async (
  req: Request<getUserInput["params"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await findUserById(id);

    if (!user)
      return next(
        createError(404, "user", JSON.stringify({ details: "user not found" }))
      );
    return res.status(200).json(omit(user.toJSON(), "password"));
  } catch (err: any) {
    log.error(err);
    return next(createError(err.status, "user", err.message));
  }
};

export const getUsersController = async (
  req: Request<{}, {}, {}, getUsersInput["query"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    let limit = 10; //default limit 10
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }

    let skip = 0; //default skip 0
    if (req.query.page) {
      skip = limit * (parseInt(req.query.page) - 1);
    }

    const _users = await findUsers(limit, skip);
    const users = _users.map((user) => omit(user.toJSON(), "password"));

    return res.status(200).json(users);
  } catch (err: any) {
    log.error(err);
    return next(createError(err.status, "user", err.message));
  }
};

export const updateUserController = async (
  req: Request<updateUserInput["params"], {}, updateUserInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const update = req.body;

    // only admins and the user themselves can update their own profile
    const currentUser = res.locals.user; //res.locals.user is set in the "protect" middleware
    if (currentUser.role !== "admin" && currentUser.id !== id)
      return next(
        createError(403, "user", JSON.stringify({ details: "forbidden" }))
      );

    // can't update email to a duplicate email
    if (update.email) {
      const isDuplicateEmail = await findUserByEmail(update.email);
      if (isDuplicateEmail)
        return next(createError(409, "email", "email already exists"));
    }

    const user = await findAndUpdateUser(id, update);

    if (!user)
      return next(
        createError(404, "user", JSON.stringify({ details: "user not found" }))
      );

    return res.status(200).json(omit(user.toJSON(), "password"));
  } catch (err: any) {
    log.error(err);
    return next(createError(err.status, "user", err.message));
  }
};

export const deleteUserController = async (
  req: Request<deleteUserInput["params"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // only admins and the user themselves can update their own profile
    const currentUser = res.locals.user; //res.locals.user is set in the "protect" middleware
    if (currentUser.role !== "admin" && currentUser.id !== id)
      return next(
        createError(403, "user", JSON.stringify({ details: "forbidden" }))
      );

    const user = await findAndDeleteUser(id);

    if (!user)
      return next(
        createError(404, "user", JSON.stringify({ details: "user not found" }))
      );

    return res.status(200).json({ success: true, message: "User deleted" });
  } catch (err: any) {
    log.error(err);
    return next(createError(err.status, "user", err.message));
  }
};

export const sendVerificationEmailController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.sendStatus(501); //TODO implement this
  } catch (err: any) {
    log.error(err);
    return next(createError(err.status, "email verification", err.message));
  }
};

export const verifyEmailController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.sendStatus(501); //TODO implement this
  } catch (err: any) {
    log.error(err);
    return next(createError(err.status, "email verification", err.message));
  }
};

export const verifyPhoneController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.sendStatus(501); //TODO implement this
  } catch (err: any) {
    log.error(err);
    return next(createError(err.status, "phone verification", err.message));
  }
};

export const sendVerificationCodeController = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.sendStatus(501); //TODO implement this
  } catch (err: any) {
    log.error(err);
    return next(createError(err.status, "phone verification", err.message));
  }
};
