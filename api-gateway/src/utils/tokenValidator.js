import { databaseServiceInterceptor } from "./interceptor";
import { InvalidTokenError } from "./errors";
import _ from "lodash";
import fs from "fs";
import path from "path";

const checkRegistry = () => {
  const registry = fs.readFileSync(
    path.resolve(__dirname, "../routes/registry.json")
  );
  const registryData = JSON.parse(registry);
  if (_.get(registryData, "service_down.name") == "database") {
    return true;
  }
};

export default (params) => async (req, __, next) => {
  // First check if database service is up // token caching case is pending
  if (checkRegistry()) {
    next();
    return;
  }

  const token = req.headers.token || req.query.token;
  if (!token) {
    throw new InvalidTokenError("Token is required");
  }
  const params = {
    query_name: "fetchTokenData",
    token,
  };
  const tokenData = await databaseServiceInterceptor(params);

  if (_.isEmpty(tokenData)) {
    throw new InvalidTokenError("Invalid Token");
  }

  req.context = tokenData;

  next();
};
