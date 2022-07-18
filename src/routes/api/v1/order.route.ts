import { Router } from "express";
import {
  createPaymentIntentController,
  confirmPaymentController,
  createOrderController,
  deleteOrderController,
  getOrderController,
  getOrdersController,
  updateOrderController,
} from "../../../controllers/order.controller";
import protect from "../../../middlewares/protect";
import validate from "../../../middlewares/validate";
import {
  createOrderSchema,
  deleteOrderSchema,
  getOrderSchema,
  getOrdersSchema,
  updateOrderSchema,
} from "../../../schema/order.schema";

const router = Router();

router.route("/create-payment-intent").post(createPaymentIntentController); //TODO: add validation schema and protect("user")
router.route("/confirm-payment").get(confirmPaymentController); //TODO: add validation schema and protect("user")

router
  .route("/:id")
  .get(protect("admin"), validate(getOrderSchema), getOrderController)
  .put(protect("admin"), validate(updateOrderSchema), updateOrderController)
  .delete(protect("admin"), validate(deleteOrderSchema), deleteOrderController);

router
  .route("/")
  .post(protect("user"), validate(createOrderSchema), createOrderController)
  .get(protect("admin"), validate(getOrdersSchema), getOrdersController);

export default router;
