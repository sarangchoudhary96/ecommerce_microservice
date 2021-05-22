import { promisify } from "util";
import config from "../config";
const { circuitBreakerCacheKey, circuitBreakerThresholdValues } = config;

export const getThresholdValue = async (redisConnection, serviceName) => {
  const keyName = circuitBreakerCacheKey(serviceName);
  const getFromRedis = promisify(redisConnection.get).bind(redisConnection);
  return await getFromRedis(keyName);
};

export default async (req, res, next) => {
  const { redisConnection } = res.locals;
  const serviceName = req.originalUrl.split("/").first();
  const thresholdValue = await getThresholdValue(redisConnection, serviceName);
  if (thresholdValue > circuitBreakerThresholdValues[serviceName]) {
    return;
  }
  next();
};
