import { Router } from "express";
import {
  createUserController,
  updateUserController,
  deleteUserController,
  getUserController,
  getAllUserController,
} from "../../../controllers/user.controller";
import protect from "../../../middlewares/protect";
import validate from "../../../middlewares/validate";
import {
  createUserSchema,
  deleteUserSchema,
  updateUserSchema,
} from "../../../schema/user.schema";

const router = Router();

router
  .route("/")
  .post(validate(createUserSchema), createUserController)
  .get(getAllUserController);

router
  .route("/:id")
  .get(getUserController)
  .put(validate(updateUserSchema), protect, updateUserController)
  .delete(validate(deleteUserSchema), protect, deleteUserController);

export default router;
