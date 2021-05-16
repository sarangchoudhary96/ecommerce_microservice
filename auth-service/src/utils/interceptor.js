import constants from "../../constants";
import _ from "lodash";
const { DATABASE_SERVICE_ENDPOINT } = constants;

const Interceptor = (service) => (req, params) => {
  const { method, headers } = req;
  return fetch(service + params, {
    method,
    headers,
    body: JSON.stringify(req.body),
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
