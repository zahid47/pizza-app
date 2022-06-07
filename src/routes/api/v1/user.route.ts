import { Router } from "express";
import {
  createUserController,
  updateUserController,
  deleteUserController,
  getUserController,
  getAllUserController,
} from "../../../controllers/user.controller";

const router = Router();

router.route("/").post(createUserController).get(getAllUserController)
router.route("/:id").get(getUserController).put(updateUserController).delete(deleteUserController);

export default router;
