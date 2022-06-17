import mongoose from "mongoose";

export interface productInputType {
  name: string;
  slug?: string;
  description?: string;
  images?: string[];
  ingredients?: string[];
  category?: string;
  isVegan?: boolean;
  optionsAvailable?: string[];
  prices: {
    price: number;
    option: string;
  }[];
  extraIngredients?: {
    name: string;
    price: string;
  }[];
  tags?: string[];
}

export interface productDocument extends productInputType, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}
