import { createClient } from "redis";

const redisClient = async () => {
  const client = createClient();
  await client.connect();

  return client;
};

export const getRedis = async (key: string) => {
  const client = await redisClient();
  const value = await client.get(key);

  return value;
};

export const setRedis = async (
  key: string,
  value: string,
  expire: number = 60 * 2 // expire in seconds, default 2 minutes
) => {
  const client = await redisClient();
  await client.set(key, value);
  await client.expire(key, expire);
};

export default redisClient;
