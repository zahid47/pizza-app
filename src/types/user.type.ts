import mongoose from "mongoose";

export interface userDocument extends mongoose.Document {
  name: string;
  email: string;
  verified: boolean;
  password: string;
  phone: string;
  address?: {
    address: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    comment?: string;
  };
  orders?: mongoose.Types.ObjectId[];
  role: string;
  couponsUsed?: {
    couponId: string;
    couponCode: string;
    dateUsed: Date;
    orderId: mongoose.Types.ObjectId;
  }[];
  comparePassword(givenPassword: string): Promise<boolean>;
}

export interface userType {
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: {
    address: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    comment?: string;
  };
}
