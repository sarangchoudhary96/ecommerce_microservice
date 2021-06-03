import fetch from "node-fetch";
import constants from "../../constants";
import _ from "lodash";
const { DATABASE_SERVICE_ENDPOINT } = constants;

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

export const databaseServiceInterceptor = Interceptor(
  DATABASE_SERVICE_ENDPOINT
);
