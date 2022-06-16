import mongoose from "mongoose";
import argon2 from "argon2";
import { userDocument } from "../types/user.type";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    verified: { type: Boolean, default: false },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      address: { type: String, required: true },
      city: String,
      state: String,
      zip: String,
      country: String,
      comment: String, //user can add a commnet to find their place easily
    },
    orders: { type: [mongoose.Types.ObjectId], ref: "Order" },
    role: { type: String, default: "user" },
    couponsUsed: [
      {
        couponId: { type: mongoose.Types.ObjectId, ref: "Coupon" },
        couponCode: String,
        dateUsed: Date,
        orderId: { type: mongoose.Types.ObjectId, ref: "Order" },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this as userDocument; // skipcq
  if (!user.isModified("password")) return next();

  const hash = await argon2.hash(user.password);
  user.password = hash;
  return next();
});

userSchema.methods.comparePassword = async function (
  givenPassword: string
): Promise<boolean> {
  const user = this as userDocument; // skipcq

  try {
    if (await argon2.verify(user.password, givenPassword)) {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};

const User = mongoose.model<userDocument>("User", userSchema);
export default User;
