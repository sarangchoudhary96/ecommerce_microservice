import _ from "lodash";
import fs from "fs";
import path from "path";
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

const updateRegistry = ({ serviceName }) => {
  const registry = fs.readFileSync(path.resolve(__dirname, "./registry.json"));
  const registryData = JSON.parse(registry);
  if (_.get(registryData, "service_down.name")) {
    return;
  }
  fs.writeFileSync(
    path.resolve(__dirname, "./registry.json"),
    JSON.stringify({
      ...registryData,
      service_down: { name: serviceName },
    }),
    "utf8"
  );
  return true;
};

router.all(
  "/api",
  asyncHandler(async (req, res) => {
    const { serviceName, path } = getServiceAndPathName({
      endpoint: req.originalUrl,
    });
    const service = registry.services[serviceName];
    const { redisConnection } = res.locals;

    if (service) {
      const response = await interceptor[_.get(service, "interceptor")](
        { ...req.body, ...req.context },
        path
      );

      if (!_.get(response, "successMessage") || _.get(response, 'data.service_down')) {
        const thresholdValue = await getThresholdValue(
          redisConnection,
          serviceName
        );

        await updateThresholdValue(
          redisConnection,
          _.get(response, "data.service_down") || serviceName,
          Number(thresholdValue) + 1
        );

        updateRegistry({
          serviceName: _.get(response, "data.service_down") || serviceName,
        });

        throw new InternalServerError(
          `${
            _.get(response, "data.service_down") || serviceName
          } service is down. we're working on it`
        );
      }
      res.create(_.get(response, "data")).success().send();
    } else {
      throw new UnknownRouteError("Invalid Route");
    }
  })
);

export default router;
