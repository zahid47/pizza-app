import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  getProductsController,
  getProductController,
  updateProductController,
} from "../../../controllers/product.controller";
import validate from "../../../middlewares/validate";
import protectAdmin from "../../../middlewares/protectAdmin";
import {
  createProductSchema,
  deleteProductSchema,
  updateProductSchema,
} from "../../../schema/product.schema";

const router = Router();

router
  .route("/")
  .post(validate(createProductSchema), protectAdmin, createProductController)
  .get(getProductsController);

router
  .route("/:id")
  .get(getProductController)
  .put(validate(updateProductSchema), protectAdmin, updateProductController)
  .delete(validate(deleteProductSchema), protectAdmin, deleteProductController);

export default router;
