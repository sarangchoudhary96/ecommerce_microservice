import _ from "lodash";
import express from "express";
import registry from "./registry.json";
import config from "../config";
import { getThresholdValue } from "../utils/circuitBreaker";
import { InternalServerError, UnknownRouteError } from "../utils/errors";
import { promisify } from "util";
import asyncHandler from "../utils/errorWrapper";
import {
  authServiceInterceptor,
  orderServiceInterceptor,
  productServiceInterceptor,
  databaseServiceInterceptor,
} from "../utils/interceptor";

const { circuitBreakerCacheKey } = config;

const interceptor = {
  authServiceInterceptor,
  orderServiceInterceptor,
  productServiceInterceptor,
  databaseServiceInterceptor,
};

const router = express.Router();

export const updateThresholdValue = async (
  redisConnection,
  serviceName,
  threshold
) => {
  const keyName = circuitBreakerCacheKey(serviceName);
  const updateInRedis = promisify(redisConnection.set).bind(redisConnection);
  return await updateInRedis(keyName, threshold.toString());
};

const getServiceAndPathName = ({ endpoint }) => {
  const endpointParts = endpoint.split("/");
  const serviceName = endpointParts[2];
  const path = endpointParts.splice(2).join("/");
  return { serviceName, path };
};

router.all(
  "/api",
  asyncHandler(async (req, res) => {
    const { serviceName, path } = getServiceAndPathName({
      endpoint: req.app.get("originalUrl"),
    });
    const service = registry.services[serviceName];
    const { redisConnection } = res.locals;

    if (service) {
      const params = { path };
      const response = interceptor[_.get(service, "interceptor")](req, params);

      if (!response) {
        const thresholdValue = await getThresholdValue(
          redisConnection,
          serviceName
        );

        await updateThresholdValue(
          redisConnection,
          serviceName,
          Number(thresholdValue) + 1
        );

        throw new InternalServerError(
          `${serviceName} service is down. we're working on it`
        );
      }

      res
        .create(...response)
        .success()
        .send();
    } else {
      throw new UnknownRouteError("Invalid Route");
    }
  })
);

export default router;
