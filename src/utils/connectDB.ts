import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongoDB Connected.");
  } catch {
    console.error("Could not connect to DB.");
    process.exit(1);
  }
};

export default connectDB;
