import fetch from "node-fetch";
import constants from "../../constants";
import _ from "lodash";
const {
  AUTH_SERVICE_ENDPOINT,
  ORDER_SERVICE_ENDPOINT,
  PRODUCT_SERVICE_ENDPOINT,
  DATABASE_SERVICE_ENDPOINT,
} = constants;

const Interceptor = (service) => (req, params) => {
  const { method, body } = req;
  return fetch(service + params, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    ...(!_.isEmpty(body) && { body: JSON.stringify(body) }),
  })
    .then((response) => response.json())
    .then((response) => {
      if (_.get(response, "errors")) {
        throw new Error("error occured", error);
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
