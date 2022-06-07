import { Request, Response } from "express";
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
    return res.status(201).send(user);
  } catch (err) {
    log.error(err);
    return res.sendStatus(409);
  }
};

export const getUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await findUser(id);

    if (!user) return res.sendStatus(404);
    return res.status(200).json(user);
  } catch (err) {
    log.error(err);
    return res.sendStatus(500);
  }
};

export const getAllUserController = async (_req: Request, res: Response) => {
  try {
    const users = await findAllUser();
    return res.status(200).json(users);
  } catch (err) {
    log.error(err);
    return res.sendStatus(500);
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const currentUser = { id: "1234" }; //TODO req.user from auth middleware

    if (currentUser.id !== id) return res.sendStatus(403);

    const user = await findAndUpdateUser(id, update);

    if (!user) return res.sendStatus(404);

    return res.status(200).json(user);
  } catch (err) {
    log.error(err);
    return res.sendStatus(500);
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = { id: "1234" }; //TODO req.user from auth middleware

    if (currentUser.id !== id) return res.sendStatus(403);

    const user = await findAndDeleteUser(id);

    if (!user) return res.sendStatus(404);

    return res.sendStatus(200);
  } catch (err) {
    log.error(err);
    return res.sendStatus(500);
  }
};
