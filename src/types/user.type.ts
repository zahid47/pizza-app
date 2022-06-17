import mongoose from "mongoose";

export interface userInputType {
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: {
    addressLine?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    comment?: string;
  };
}

export interface userDocument extends userInputType, mongoose.Document {
  verified: boolean;
  orders?: mongoose.Types.ObjectId[];
  role: string;
  couponsUsed?: {
    couponId: string;
    couponCode: string;
    dateUsed: Date;
    orderId: mongoose.Types.ObjectId;
  }[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(givenPassword: string): Promise<boolean>;
}
