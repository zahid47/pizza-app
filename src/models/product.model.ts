import mongoose from "mongoose";
import { productDocument } from "../types/product.type";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String },
    description: String,
    images: [String],
    ingredients: [String],
    category: String,
    isVegan: { type: Boolean, default: false },
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
        price: { type: Number, required: true },
      },
    ],
    tags: [String],
  },

  { timestamps: true }
);

productSchema.pre("save", function (next) {
  const product = this as productDocument; // skipcq
  if (!product.isModified("name")) return next();

  product.slug = product.name.replaceAll(" ", "-");
  return next();
});

const Product = mongoose.model<productDocument>("Product", productSchema);
export default Product;
