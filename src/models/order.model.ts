import mongoose from "mongoose";
import { orderDocument } from "../types/order.type";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        variant: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    payment: {
      paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
        required: true,
      },
      method: {
        type: String,
        enum: ["cash", "card"],
        required: true,
        default: "cash",
      },
    },
    total: { type: Number, required: true, default: 0 }, //FIXME: calculate total using pre
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "cooking",
        "on the way",
        "delevered",
        "cancelled",
      ],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model<orderDocument>("Order", orderSchema);
export default Order;
