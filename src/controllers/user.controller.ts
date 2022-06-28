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
  findUser,
  findUsers,
  findAndUpdateUser,
  findAndDeleteUser,
} from "../services/user.service";
import createError from "../utils/createError";
import log from "../utils/logger";

export const createUserController = async (
  req: Request<{}, {}, createUserInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await createUser(req.body);
    return res.status(201).json(omit(user.toJSON(), "password"));
  } catch (err: any) {
    log.error(err);
    return next(createError(409, "email", "email already exists"));
  }
};

export const getUserController = async (
  req: Request<getUserInput["params"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await findUser(id);

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

    const users = await findUsers(limit, skip);
    return res.status(200).json(users); //TODO omit password
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

    const currentUser = res.locals.user; //res.locals.user is set in the "protect" middleware
    if (currentUser.role !== "admin" && currentUser.id !== id)
      return next(
        createError(403, "user", JSON.stringify({ details: "forbidden" }))
      );

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
