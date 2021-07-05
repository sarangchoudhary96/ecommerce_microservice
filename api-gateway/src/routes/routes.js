import _ from "lodash";
import express from "express";
import registry from "./registry.json";
import { UnknownRouteError } from "../utils/errors";
import asyncHandler from "../utils/errorWrapper";
import {
  authServiceInterceptor,
  orderServiceInterceptor,
  productServiceInterceptor,
  databaseServiceInterceptor,
} from "../utils/interceptor";

const interceptor = {
  authServiceInterceptor,
  orderServiceInterceptor,
  productServiceInterceptor,
  databaseServiceInterceptor,
};

const router = express.Router();

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
      endpoint: req.originalUrl,
    });
    const service = registry.services[serviceName];

    if (service) {
      const response = await interceptor[_.get(service, "interceptor")](
        { ...req.body, ...req.context },
        path
      );

      res.create(_.get(response, "data")).success().send();
    } else {
      throw new UnknownRouteError("Invalid Route");
    }
  })
);

export default router;
