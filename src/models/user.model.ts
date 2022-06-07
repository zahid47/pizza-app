import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { userDocument } from "../types/user.type";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, unique: true },
    verified: { type: Boolean, default: false },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    orders: { type: [mongoose.Types.ObjectId] },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  let user = this as userDocument; // skipcq
  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(process.env.SALT_WORK_FACTOR);
  const hash = await bcrypt.hash(user.password, salt);

  user.password = hash;
  return next();
});

userSchema.methods["comparePassword"] = function (
  givenPassword: string
): Promise<boolean> {
  const user = this as userDocument; // skipcq

  return new Promise((resolve, reject) => {
    bcrypt.compare(givenPassword, user.password, (err, success) => {
      if (err) return reject(err);
      return resolve(success);
    });
  });
};

const User = mongoose.model<userDocument>("User", userSchema);
export default User;
