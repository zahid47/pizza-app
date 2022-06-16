import { Router } from "express";
import { loginController } from "../../../controllers/auth.controller";
import validate from "../../../middlewares/validate";
import { loginSchema } from "../../../schema/auth.schema";

const router = Router();

router.route("/login").post(validate(loginSchema), loginController);

export default router;
