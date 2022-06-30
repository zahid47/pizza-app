import mongoose from "mongoose";

export interface orderInputType {
  products: { product: string; variant: string; quantity: number }[];
  payment: {
    paymentStatus?: string;
    method?: string;
  };
}

export interface orderDocument extends orderInputType, mongoose.Document {
  user: string;
  total?: number;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}
