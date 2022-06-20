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
import multer from "multer";

const router = Router();
const storage = multer.diskStorage({});
const upload = multer({ storage });

router
  .route("/")
  .post(
    validate(createProductSchema),
    protectAdmin,
    upload.array("photos"),
    createProductController
  )
  .get(getProductsController);

router
  .route("/:id")
  .get(getProductController)
  .put(
    validate(updateProductSchema),
    protectAdmin,
    upload.array("photos"),
    updateProductController
  )
  .delete(validate(deleteProductSchema), protectAdmin, deleteProductController);

export default router;
