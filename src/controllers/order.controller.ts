import { Request, Response, NextFunction } from "express";
import log from "../utils/logger";
import createError from "../utils/createError";
import {
  createOrderInput,
  deleteOrderInput,
  getOrderInput,
  getOrdersInput,
  updateOrderInput,
  validateManagePaymentStatusInput,
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
import { verifyToken } from "../utils/jwt";

export const createOrderController = async (
  req: Request<{}, {}, createOrderInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const orderDetails = { ...req.body, user: res.locals.user._id };

    // security check for total price
    const total = await calculateTotal(req.body.products);
    if (req.body.total && total !== req.body.total)
      return next(createError(400, "calculate total", "Total mismatch"));

    orderDetails.total = total;
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

export const createCheckoutSessionController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2022-08-01",
    });

    const { products, order, accessToken } = req.body;

    const session = await stripe.checkout.sessions.create({
      customer_email: res.locals.user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Pizza",
            },
            unit_amount: (await calculateTotal(products)) * 100, //converting to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.SERVER_URL}/api/v1/order/payment?status=success&orderId=${order._id}&accessToken=${accessToken}`,
      cancel_url: `${process.env.SERVER_URL}/api/v1/order/payment?status=cancel&orderId=${order._id}&accessToken=${accessToken}`,
    });

    //@ts-ignore
    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    log.error(err);
    return next(createError(err.status, "stripe", err));
  }
};

export const managePaymentStatusController = async (
  req: Request<{}, {}, validateManagePaymentStatusInput["query"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const status = req.query.status as string;
    const orderId = req.query.orderId as string;
    const accessToken = req.query.accessToken as string;

    try {
      const access_secret: string = process.env.ACCESS_SECRET;
      const { valid, expired } = verifyToken(accessToken, access_secret);

      if (!valid)
        return next(
          createError(
            401,
            "jwt",
            JSON.stringify({ details: "unauthorized, bad token" })
          )
        );

      if (expired)
        return next(
          createError(401, "jwt", JSON.stringify({ details: "token expired" }))
        );

      if (status === "cancel") {
        await findAndUpdateOrder(orderId, { status: "cancelled" });
      } else if (status === "success") {
        await findAndUpdateOrder(orderId, {
          payment: {
            paymentStatus: "paid",
            method: "card",
          },
        });
      }
    } catch (err: any) {
      return next(createError(401, "jwt", err.message));
    }

    return res
      .status(303)
      .redirect(`${process.env.CLIENT_URL}/orders?sucess=true`);
  } catch (err: any) {
    log.error(err);
    return next(createError(err.status, "stripe", err));
  }
};
