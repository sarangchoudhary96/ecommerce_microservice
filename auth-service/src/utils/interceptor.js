import fetch from "node-fetch";
import constants from "../../constants";
import _ from "lodash";
import { byPassError } from "../utils/error";
const { DATABASE_SERVICE_ENDPOINT } = constants;

const Interceptor = (service) => (params, path) => {
  return fetch(service + (path || "db"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    ...(!_.isEmpty(params) && { body: JSON.stringify(params) }),
  })
    .then((response) => response.json())
    .then((response) => {
      if (_.get(response, "errorMessage") && _.get(response, "errors")) {
        throw new byPassError(
          _.get(response, "errorMessage.message"),
          _.get(response, "error_code"),
          _.get(response, "errors")
        );
      }
      return response;
    })
    .catch((err) => {
      throw err;
    });
};

export const databaseServiceInterceptor = Interceptor(
  DATABASE_SERVICE_ENDPOINT
);
