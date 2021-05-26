import { promisify } from "util";
import config from "../config";
import { InternalServerError } from "./errors";
const { circuitBreakerCacheKey, circuitBreakerThresholdValues } = config;

export const getThresholdValue = async (redisConnection, serviceName) => {
  const keyName = circuitBreakerCacheKey(serviceName);
  const getFromRedis = promisify(redisConnection.get).bind(redisConnection);
  return await getFromRedis(keyName);
};

export default (params) => async (req, res, next) => {
  const { redisConnection } = res.locals;
  const serviceName = req.originalUrl.split("/")[1];
  const thresholdValue = await getThresholdValue(redisConnection, serviceName);
  if (thresholdValue > circuitBreakerThresholdValues[serviceName]) {
    throw new InternalServerError(
      `${serviceName} service is down. we're working on it`
    );
  }
  next();
};
