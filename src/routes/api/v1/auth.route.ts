import { Router } from "express";
import {
  loginController,
  getMeController,
} from "../../../controllers/auth.controller";
import protect from "../../../middlewares/protect";
import validate from "../../../middlewares/validate";
import { loginSchema } from "../../../schema/auth.schema";

const router = Router();

router.route("/login").post(validate(loginSchema), loginController);
router.route("/me").get(protect, getMeController);

export default router;
