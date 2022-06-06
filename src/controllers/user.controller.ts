import { Request, Response } from "express";
import { createUser } from "../services/user.service";
import log from "../utils/logger";

export const createUserController = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    return res.status(201).send(user);
  } catch (err) {
    log.info(err);
    return res.sendStatus(409);
  }
};