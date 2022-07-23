import { createClient } from "redis";
import log from "../utils/logger";

const connectRedis = async () => {
  try {
    const client = createClient();
    await client.connect();
    log.info("Redis Connected");
  } catch {
    log.error("Could not connect to Redis");
  }
};

export default connectRedis;
