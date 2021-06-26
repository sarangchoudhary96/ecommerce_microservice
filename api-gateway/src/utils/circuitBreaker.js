import _ from "lodash";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import config from "../config";
import { InternalServerError } from "./errors";
import registry from "../routes/registry.json";
const { circuitBreakerCacheKey, circuitBreakerThresholdValues } = config;

export const getThresholdValue = async (redisConnection, serviceName) => {
  const keyName = circuitBreakerCacheKey(serviceName);
  const getFromRedis = promisify(redisConnection.get).bind(redisConnection);
  return await getFromRedis(keyName);
};

const updateRegistry = () => {
  const registry = fs.readFileSync(
    path.resolve(__dirname, "../routes/registry.json")
  );
  const registryData = JSON.parse(registry);
  if (_.get(registryData, "service_down.name")) {
    delete registryData.service_down;
    fs.writeFileSync(
      path.resolve(__dirname, "../routes/registry.json"),
      JSON.stringify({
        ...registryData,
      }),
      "utf8"
    );
  }
  return true;
};

export default (params) => async (req, res, next) => {
  const { redisConnection } = res.locals;
  const serviceName = _.get(registry, "service_down.name", "");
  const thresholdValue = await getThresholdValue(redisConnection, serviceName);

  // if not found in cache that mean service has been up and then we've to remove down service name from registry
  if (!thresholdValue) {
    updateRegistry();
  }
  if (thresholdValue > circuitBreakerThresholdValues[serviceName]) {
    throw new InternalServerError(
      `${serviceName} service is down. we're working on it`
    );
  }
  next();
};
