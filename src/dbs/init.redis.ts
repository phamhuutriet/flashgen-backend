import { createClient } from "redis";

export const getRedisClient = async () => {
  const redisClient = createClient();
  await redisClient.connect();
  return redisClient;
};
