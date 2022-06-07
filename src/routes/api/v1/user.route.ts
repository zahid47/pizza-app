import { Router } from "express";
import {
  createUserController,
  updateUserController,
  deleteUserController,
  getUserController,
  getAllUserController,
} from "../../../controllers/user.controller";
import validate from "../../../middlewares/validate";
import { createUserSchema } from "../../../schema/user.schema";

const router = Router();

router
  .route("/")
  .post(validate(createUserSchema), createUserController)
  .get(getAllUserController);

router
  .route("/:id")
  .get(getUserController)
  .put(updateUserController)
  .delete(deleteUserController);

export default router;
