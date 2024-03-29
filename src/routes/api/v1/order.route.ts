import { Router } from "express";
import {
  createOrderController,
  deleteOrderController,
  getOrderController,
  getOrdersController,
  updateOrderController,
  createCheckoutSessionController,
  managePaymentStatusController,
} from "../../../controllers/order.controller";
import protect from "../../../middlewares/protect";
import validate from "../../../middlewares/validate";
import {
  createOrderSchema,
  deleteOrderSchema,
  getOrderSchema,
  getOrdersSchema,
  updateOrderSchema,
  validateManagePaymentStatusSchema,
} from "../../../schema/order.schema";

const router = Router();

router
  .route("/create-checkout-session")
  .post(protect("user"), createCheckoutSessionController);

//FIXME: anyone can hit this get route and make their order paid, without actually paying (which is really bad!)
router
  .route("/payment")
  .get(
    validate(validateManagePaymentStatusSchema),
    managePaymentStatusController
  );

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
