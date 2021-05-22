import redis from "redis";
import config from "../src/config";
const { redisConfig } = config;

export default () =>
  redis.createClient({
    port: redisConfig.PORT,
    host: redisConfig.HOST,
  });
