import { createClient } from "redis";

const initRedis = async () => {
  const client = createClient();
  await client.connect();

  return client;
};

export default initRedis;
