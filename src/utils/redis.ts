import { createClient } from "redis";
import log from "../utils/logger";

const redisClient = async () => {
  try {
    const client = createClient();
    await client.connect();

    return client;
  } catch {
    log.warn("could not connect to redis");
    return;
  }
};

export const getRedis = async (key: string) => {
  const client = await redisClient();
  if (!client) return;

  const value = await client.get(key);
  return value;
};

export const setRedis = async (
  key: string,
  value: string,
  expire: number = 60 * 2 // expire in seconds, default 2 minutes
) => {
  const client = await redisClient();

  if (!client) return;

  await client.set(key, value);
  await client.expire(key, expire);
};

export default redisClient;
