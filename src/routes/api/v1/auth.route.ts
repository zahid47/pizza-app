import { Router } from "express";
import {
  loginController,
  getMeController,
  refreshAccessTokenController,
  resetPassController,
  sendResetPassEmailController,
} from "../../../controllers/auth.controller";
import protect from "../../../middlewares/protect";
import validate from "../../../middlewares/validate";
import { loginSchema } from "../../../schema/auth.schema";

const router = Router();

router.route("/login").post(validate(loginSchema), loginController);
router.route("/me").get(protect("user"), getMeController);
router.route("/refresh").get(refreshAccessTokenController); // TODO : add validation schema
router.route("/reset-pass/:token").post(resetPassController); // TODO : add validation schema
router.route("/reset-pass").post(sendResetPassEmailController); // TODO : add validation schema

export default router;
