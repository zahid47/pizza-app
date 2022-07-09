import Order from "../models/order.model";
import { orderInputType } from "../types/order.type";
import { UpdateQuery } from "mongoose";

export const createOrder = async (input: orderInputType) => {
  try {
    return await Order.create(input);

    // skipcq
  } catch (err: any) {
    throw new Error(err);
  }
};

export const findOrder = async (id: string) => {
  try {
    return await Order.findById(id)
      .populate("user", "name email phone address")
      .populate("products.product", "name");
    // skipcq
  } catch (err: any) {
    throw new Error(err);
  }
};

export const findOrders = async (limit: number, skip: number) => {
  try {
    return await Order.find().limit(limit).skip(skip).populate("user", "name");
    // skipcq
  } catch (err: any) {
    throw new Error(err);
  }
};

export const findOrdersByUser = async (
  userId: string,
  limit: number,
  skip: number
) => {
  try {
    return await Order.find({ user: userId }).limit(limit).skip(skip);
    // skipcq
  } catch (err: any) {
    throw new Error(err);
  }
};

export const findAndUpdateOrder = async (
  id: string,
  update: UpdateQuery<Partial<orderInputType>>
) => {
  try {
    return await Order.findByIdAndUpdate(id, update, { new: true });
    // skipcq
  } catch (err: any) {
    throw new Error(err);
  }
};

export const findAndDeleteOrder = async (id: string) => {
  try {
    return await Order.findByIdAndDelete(id);
    // skipcq
  } catch (err: any) {
    throw new Error(err);
  }
};
