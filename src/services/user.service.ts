import User from "../models/user.model";
import { userType } from "../types/user.type";
import { UpdateQuery } from "mongoose";

export const createUser = async (input: userType) => {
  try {
    return await User.create(input);
  } catch (err: any) { // skipcq
    throw new Error(err);
  }
};

export const findUser = async (id: string) => {
  try {
    return await User.findById(id);
  } catch (err: any) { // skipcq
    throw new Error(err);
  }
};

export const findAllUser = async () => {
  try {
    return await User.find();
  } catch (err: any) { // skipcq
    throw new Error(err);
  }
};

export const findAndUpdateUser = async (
  id: string,
  update: UpdateQuery<Partial<userType>>
) => {
  try {
    return await User.findByIdAndUpdate(id, update, { new: true });
  } catch (err: any) { // skipcq
    throw new Error(err);
  }
};

export const findAndDeleteUser = async (id: string) => {
  try {
    return await User.findByIdAndDelete(id);
  } catch (err: any) { // skipcq
    throw new Error(err);
  }
};
