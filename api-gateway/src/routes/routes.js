import express from "express";
import registry from "./registry.json";
import _ from "lodash";
import config from "../config";
import { getThresholdValue } from "../utils/circuitBreaker";
const { circuitBreakerCacheKey } = config;

const router = express.Router();

export const updateThresholdValue = async (
  redisConnection,
  serviceName,
  threshold
) => {
  const keyName = circuitBreakerCacheKey(serviceName);
  const updateInRedis = promisify(redisConnection.update).bind(redisConnection);
  return await updateInRedis(keyName, threshold);
};

router.all("/:apiName/:path", async (req, res) => {
  const { apiName: serviceName, path } = req.params;
  const service = registry.services[serviceName];
  const { redisConnection } = res.locals;

  if (service) {
    const params = { path };
    const response = _.get(service, "interceptor")(req, params);

    if (!response) {
      const thresholdValue = await getThresholdValue(
        redisConnection,
        serviceName
      );

      await updateThresholdValue(
        redisConnection,
        serviceName,
        thresholdValue + 1
      );

      redis.send(`${serviceName} service is down`);
    }

    res.send(response);
  } else {
    res.send("API does not exist");
  }
});

export default router;
