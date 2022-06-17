import mongoose from "mongoose";

export interface productInputType {
  name: string;
  slug?: string;
  description?: string;
  images?: string[];
  ingredients?: string[];
  category?: string;
  isVegan?: boolean;
  prices: {
    price: number;
    option: string;
  }[];
  extraIngredients?: {
    name: string;
    price: number;
  }[];
  tags?: string[];
}

export interface productDocument extends productInputType, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}
