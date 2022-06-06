import User from "../model/user.model";
import { userType } from "../types/user.type";

export const createUser = async (input: userType) => {
  try {
    return await User.create(input);
  } catch (err: any) {
    throw new Error(err);
  }
};
