import mongoose from "mongoose";

export interface orderInputType {
  user: string;
  products: { product: string; variant: string; quantity: number }[];
  payment: {
    paymentStatus?: string;
    method?: string;
  };
  total?: number;
  status?: string;
}

export interface orderDocument extends orderInputType, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}
