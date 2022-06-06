import mongoose from "mongoose";
import log from "./logger";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    log.info("mongoDB Connected.");
  } catch {
    log.error("Could not connect to DB.");
    process.exit(1);
  }
};

export default connectDB;
