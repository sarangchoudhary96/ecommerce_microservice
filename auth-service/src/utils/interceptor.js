import fetch from "node-fetch";
import constants from "../../constants";
import _ from "lodash";
import { MessageError } from "../utils/error";
const { DATABASE_SERVICE_ENDPOINT } = constants;

const Interceptor = (service) => (params, path) => {
  return fetch(service + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    ...(!_.isEmpty(params) && { body: JSON.stringify(params) }),
  })
    .then((response) => response.json())
    .then((response) => {
      if (_.get(response, "errorMessage")) {
        throw new MessageError(_.get(response, "errorMessage.message"));
      }
      return response;
    })
    .then((response) => {
      if (_.get(response, "errors")) {
        throw new Error("error occured", error);
      }
      return response;
    });
};

export const databaseServiceInterceptor = Interceptor(
  DATABASE_SERVICE_ENDPOINT
);
