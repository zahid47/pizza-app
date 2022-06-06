import mongoose from "mongoose";

export interface userDocument extends mongoose.Document {
  name: string;
  email: string;
  verified: boolean;
  password: string;
  phone: string;
  address?: string;
  orders?: mongoose.Types.ObjectId[];
  isAdmin: boolean;
  comparePassword(givenPassword: string): Promise<boolean>;
}

export interface userType {
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
}
