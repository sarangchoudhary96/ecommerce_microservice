import fetch from "node-fetch";
import constants from "../../constants";
import _ from "lodash";
import { MessageError } from "../utils/errors";
const {
  AUTH_SERVICE_ENDPOINT,
  ORDER_SERVICE_ENDPOINT,
  PRODUCT_SERVICE_ENDPOINT,
  DATABASE_SERVICE_ENDPOINT,
} = constants;

const Interceptor = (service) => (params, path) => {
  return fetch(service + (path || "db"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    ...(!_.isEmpty(params) && { body: JSON.stringify(params) }),
  })
    .then((response) => response.json())
    .then((response) => {
      if (_.get(response, "errorMessage")) {
        throw new MessageError(
          _.get(response, "errorMessage"),
          _.get(response, "errors")
        );
      }
      return response;
    });
};

export const authServiceInterceptor = Interceptor(AUTH_SERVICE_ENDPOINT);
export const orderServiceInterceptor = Interceptor(ORDER_SERVICE_ENDPOINT);
export const productServiceInterceptor = Interceptor(PRODUCT_SERVICE_ENDPOINT);
export const databaseServiceInterceptor = Interceptor(
  DATABASE_SERVICE_ENDPOINT
);
