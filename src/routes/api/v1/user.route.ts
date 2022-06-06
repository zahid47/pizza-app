import { Router } from "express";
import { createUserController } from "../../../controllers/user.controller";

const router = Router();

router.route("/").post(createUserController);

export default router;
