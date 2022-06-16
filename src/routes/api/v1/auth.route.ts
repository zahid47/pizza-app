import { Router } from "express";
import { loginController } from "../../../controllers/auth.controller";

const router = Router();

router.route("/login").post(loginController);

export default router;
