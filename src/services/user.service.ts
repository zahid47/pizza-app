import User from "../models/user.model";
import { userInputType } from "../types/user.type";
import { UpdateQuery } from "mongoose";

export const createUser = async (input: userInputType) => {
  try {
    return await User.create(input);
    // skipcq
  } catch (err: any) {
    throw new Error(err);
  }
};

export const findUser = async (id: string) => {
  try {
    return await User.findById(id);
    // skipcq
  } catch (err: any) {
    throw new Error(err);
  }
};

export const findUsers = async (limit: number, skip: number) => {
  try {
    return await User.find().limit(limit).skip(skip);
    // skipcq
  } catch (err: any) {
    throw new Error(err);
  }
};

export const findAndUpdateUser = async (
  id: string,
  update: UpdateQuery<Partial<userInputType>>
) => {
  try {
    return await User.findByIdAndUpdate(id, update, { new: true });
    // skipcq
  } catch (err: any) {
    throw new Error(err);
  }
};

export const findAndDeleteUser = async (id: string) => {
  try {
    return await User.findByIdAndDelete(id);
    // skipcq
  } catch (err: any) {
    throw new Error(err);
  }
};
