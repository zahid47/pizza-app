import mongoose from "mongoose";
import { productDocument } from "../types/product.type";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    image: String,
    ingredients: [String],
    category: String,
    type: String,
    isVegan: { type: Boolean, default: false },
    optionsAvailable: [String],
    prices: {
      type: [
        {
          price: { type: Number, required: true },
          option: { type: String, required: true },
        },
      ],
      required: true,
    },
    extraIngredients: [
      {
        name: { type: String, required: true },
        price: { type: String, required: true },
      },
    ],
    tags: [String],
  },

  { timestamps: true }
);

const Product = mongoose.model<productDocument>("Product", productSchema);
export default Product;
