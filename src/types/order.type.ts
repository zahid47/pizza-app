import mongoose from "mongoose";

export interface orderedProductsType {
  product: string; //_id
  option: string;
  quantity: number;
}

export interface orderInputType {
  products: { product: string; option: string; quantity: number }[];
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
  calculateTotal(products: orderedProductsType[]): Promise<number>;
}
