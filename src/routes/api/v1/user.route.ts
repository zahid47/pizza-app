import { Router } from "express";
import { getOrdersByUserController } from "../../../controllers/order.controller";
import {
  createUserController,
  updateUserController,
  deleteUserController,
  getUserController,
  getUsersController,
  verifyEmailController,
  sendVerificationEmailController,
  verifyPhoneController,
  sendVerificationCodeController,
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

router.route("/verify/email/:code").get(verifyEmailController);
router.route("/verify/email").get(sendVerificationEmailController);

router.route("/verify/phone/:code").get(verifyPhoneController); // TODO : add validation schema
router.route("/verify/phone").get(sendVerificationCodeController); // TODO : add validation schema

router
  .route("/:id")
  .get(protect("admin"), validate(getUserSchema), getUserController)
  .put(protect("user"), validate(updateUserSchema), updateUserController)
  .delete(protect("user"), validate(deleteUserSchema), deleteUserController);

export default router;
