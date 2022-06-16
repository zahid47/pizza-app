import Product from "../models/product.model";
import { productInputType } from "../types/product.type";
import { UpdateQuery } from "mongoose";

export const createProduct = async (input: productInputType) => {
  try {
    return await Product.create(input);
    // skipcq
  } catch (err: any) {
    throw new Error(err);
  }
};

export const findProduct = async (id: string) => {
  try {
    return await Product.findById(id);
    // skipcq
  } catch (err: any) {
    throw new Error(err);
  }
};

export const findAllProduct = async () => {
  try {
    return await Product.find();
    // skipcq
  } catch (err: any) {
    throw new Error(err);
  }
};

export const findAndUpdateProduct = async (
  id: string,
  update: UpdateQuery<Partial<productInputType>>
) => {
  try {
    return await Product.findByIdAndUpdate(id, update, { new: true });
    // skipcq
  } catch (err: any) {
    throw new Error(err);
  }
};

export const findAndDeleteProduct = async (id: string) => {
  try {
    return await Product.findByIdAndDelete(id);
    // skipcq
  } catch (err: any) {
    throw new Error(err);
  }
};