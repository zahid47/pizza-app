import { Router } from "express";
import {
  createProductController,
  deleteProductController,
  getProductsController,
  getProductController,
  updateProductController,
} from "../../../controllers/product.controller";
import validate from "../../../middlewares/validate";
import protect from "../../../middlewares/protect";
import {
  createProductSchema,
  deleteProductSchema,
  updateProductSchema,
} from "../../../schema/product.schema";
import multer from "multer";
import fileFilter from "../../../utils/fileFilter";

const router = Router();
const storage = multer.diskStorage({});
const upload = multer({ storage, fileFilter });

router
  .route("/")
  .post(
    validate(createProductSchema),
    protect("admin"),
    upload.array("photos"),
    createProductController
  )
  .get(getProductsController);

router
  .route("/:id")
  .get(getProductController)
  .put(
    validate(updateProductSchema),
    protect("admin"),
    upload.array("photos"),
    updateProductController
  )
  .delete(validate(deleteProductSchema), protect("admin"), deleteProductController);

export default router;
