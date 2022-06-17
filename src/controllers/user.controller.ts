import { Request, Response } from "express";
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
import log from "../utils/logger";

export const createUserController = async (
  req: Request<{}, {}, createUserInput["body"]>,
  res: Response
) => {
  try {
    const user = await createUser(req.body);
    return res.status(201).send(omit(user.toJSON(), "password"));
  } catch (err: any) {
    log.error(err);
    return res.status(409).json({ email: "email already exists" });
  }
};

export const getUserController = async (
  req: Request<getUserInput["params"]>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const user = await findUser(id);

    if (!user) return res.sendStatus(404);
    return res.status(200).json(omit(user.toJSON(), "password"));
  } catch (err: any) {
    log.error(err);
    return res.status(500).json(err.message || err);
  }
};

export const getUsersController = async (
  req: Request<{}, {}, {}, getUsersInput["query"]>,
  res: Response
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
    return res.status(500).json(err.message || err);
  }
};

export const updateUserController = async (
  req: Request<updateUserInput["params"], {}, updateUserInput["body"]>,
  res: Response
) => {
  try {
    const id = req.params.id;
    const update = req.body;

    const currentUser = res.locals.user; //res.locals.user is set in the "protect" middleware
    if (currentUser.role !== "admin" && currentUser.id !== id)
      return res.sendStatus(403);

    const user = await findAndUpdateUser(id, update);

    if (!user) return res.sendStatus(404);

    return res.status(200).json(omit(user.toJSON(), "password"));
  } catch (err: any) {
    log.error(err);
    return res.status(500).json(err.message || err);
  }
};

export const deleteUserController = async (
  req: Request<deleteUserInput["params"]>,
  res: Response
) => {
  try {
    const { id } = req.params;
    
    const currentUser = res.locals.user; //res.locals.user is set in the "protect" middleware
    if (currentUser.role !== "admin" && currentUser.id !== id)
    return res.sendStatus(403);

    const user = await findAndDeleteUser(id);

    if (!user) return res.sendStatus(404);

    return res.sendStatus(200);
  } catch (err: any) {
    log.error(err);
    return res.status(500).json(err.message || err);
  }
};
