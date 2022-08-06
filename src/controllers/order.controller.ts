import { Request, Response, NextFunction } from "express";
import log from "../utils/logger";
import createError from "../utils/createError";
import {
  createOrderInput,
  createPaymentIntentType,
  deleteOrderInput,
  getOrderInput,
  getOrdersInput,
  updateOrderInput,
} from "../schema/order.schema";
import {
  calculateTotal,
  createOrder,
  findAndDeleteOrder,
  findAndUpdateOrder,
  findOrder,
  findOrders,
  findOrdersByUser,
} from "../services/order.service";
import Stripe from "stripe";

export const createOrderController = async (
  req: Request<{}, {}, createOrderInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderDetails = { ...req.body, user: res.locals.user._id };

    // security check for total price
    const total = await calculateTotal(req.body.products);
    if (total !== req.body.total)
      return next(createError(400, "calculate total", "Total mismatch"));

    const order = await createOrder(orderDetails);
    return res.status(201).json(order);
  } catch (err: any) {
    log.error(err);
    return next(createError(err.status, "order", err.message));
  }
};

export const getOrderController = async (
  req: Request<getOrderInput["params"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const order = await findOrder(id);

    if (!order)
      return next(
        createError(
          404,
          "order",
          JSON.stringify({ details: "order not found" })
        )
      );
    return res.status(200).json(order);
  } catch (err: any) {
    log.error(err);
    return next(createError(err.status, "order", err));
  }
};

export const getOrdersController = async (
  req: Request<{}, {}, {}, getOrdersInput["query"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    let limit = 10; //default limit 10
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }

    let skip = 0; //default skip 0
    if (req.query.page) {
      skip = limit * (parseInt(req.query.page) - 1);
    }

    const orders = await findOrders(limit, skip);
    return res.status(200).json(orders);
  } catch (err: any) {
    log.error(err);
    return next(createError(err.status, "order", err));
  }
};

export const getOrdersByUserController = async (
  req: Request<{}, {}, {}, getOrdersInput["query"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    let limit = 10; //default limit 10
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }

    let skip = 0; //default skip 0
    if (req.query.page) {
      skip = limit * (parseInt(req.query.page) - 1);
    }

    const userId = res.locals.user._id;

    const orders = await findOrdersByUser(userId, limit, skip);
    return res.status(200).json(orders);
  } catch (err: any) {
    log.error(err);
    return next(createError(err.status, "order", err));
  }
};

export const updateOrderController = async (
  req: Request<updateOrderInput["params"], {}, updateOrderInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const order = await findAndUpdateOrder(id, update);

    if (!order)
      return next(
        createError(
          404,
          "order",
          JSON.stringify({ details: "order not found" })
        )
      );

    return res.status(200).json(order);
  } catch (err: any) {
    log.error(err);
    return next(createError(err.status, "order", err));
  }
};

export const deleteOrderController = async (
  req: Request<deleteOrderInput["params"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const order = await findAndDeleteOrder(id);

    if (!order)
      return next(
        createError(
          404,
          "order",
          JSON.stringify({ details: "order not found" })
        )
      );

    return res.status(200).json({ success: true, message: "order deleted" });
  } catch (err: any) {
    log.error(err);
    return next(createError(err.status, "order", err));
  }
};

export const createPaymentIntentController = async (
  req: Request<{}, {}, createPaymentIntentType["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2020-08-27",
    });

    const items = req.body.products;

    // security check for total price
    const total = await calculateTotal(items);
    if (total !== req.body.total)
      return next(createError(400, "calculate total", "Total mismatch"));

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd"
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err: any) {
    log.error(err);
    return next(createError(err.status, "order - create payment intent", err));
  }
};

export const confirmPaymentController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const status = req.query.redirect_status;
    //TODO: change payment status to "paid", but IDK how without orderID
    return res.status(303).redirect(`${process.env.CLIENT_URL}/orders`);
  } catch (err: any) {
    log.error(err);
    return next(createError(err.status, "order - create payment intent", err));
  }
};
