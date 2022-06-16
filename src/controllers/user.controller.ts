import { Request, Response } from "express";
import { omit } from "lodash";
import {
  createUser,
  findUser,
  findAllUser,
  findAndUpdateUser,
  findAndDeleteUser,
} from "../services/user.service";
import log from "../utils/logger";

export const createUserController = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    return res.status(201).send(omit(user.toJSON(), "password"));
  } catch (err) {
    log.error(err);
    return res.status(409).json({ email: "email already exists" });
  }
};

export const getUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await findUser(id);

    if (!user) return res.sendStatus(404);
    return res.status(200).json(omit(user.toJSON(), "password"));
  } catch (err) {
    log.error(err);
    return res.sendStatus(500);
  }
};

export const getAllUserController = async (_req: Request, res: Response) => {
  try {
    const users = await findAllUser();
    return res.status(200).json(users); //TODO omit password
  } catch (err) {
    log.error(err);
    return res.sendStatus(500);
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const currentUser = res.locals.user; //res.locals.user is set in the "protect" middleware

    if (currentUser.id !== id) return res.sendStatus(403);

    const user = await findAndUpdateUser(id, update);

    if (!user) return res.sendStatus(404);

    return res.status(200).json(omit(user.toJSON(), "password"));
  } catch (err) {
    log.error(err);
    return res.sendStatus(500);
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = res.locals.user; //res.locals.user is set in the "protect" middleware

    if (currentUser.id !== id) return res.sendStatus(403);

    const user = await findAndDeleteUser(id);

    if (!user) return res.sendStatus(404);

    return res.sendStatus(200);
  } catch (err) {
    log.error(err);
    return res.sendStatus(500);
  }
};
