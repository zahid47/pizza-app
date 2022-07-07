import { Router } from "express";
import { getOrdersByUserController } from "../../../controllers/order.controller";
import {
  createUserController,
  updateUserController,
  deleteUserController,
  getUserController,
  getUsersController,
} from "../../../controllers/user.controller";
import protect from "../../../middlewares/protect";
import validate from "../../../middlewares/validate";
import { getOrdersSchema } from "../../../schema/order.schema";
import {
  createUserSchema,
  deleteUserSchema,
  getUserSchema,
  getUsersSchema,
  updateUserSchema,
} from "../../../schema/user.schema";

const router = Router();

router
  .route("/")
  .post(validate(createUserSchema), createUserController)
  .get(protect("admin"), validate(getUsersSchema), getUsersController);

router
  .route("/orders")
  .get(protect("user"), validate(getOrdersSchema), getOrdersByUserController);

router
  .route("/:id")
  .get(protect("admin"), validate(getUserSchema), getUserController)
  .put(protect("user"), validate(updateUserSchema), updateUserController)
  .delete(protect("user"), validate(deleteUserSchema), deleteUserController);

export default router;
