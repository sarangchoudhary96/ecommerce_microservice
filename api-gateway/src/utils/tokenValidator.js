import { databaseServiceInterceptor } from "./interceptor";
import { InvalidTokenError } from "./errors";
import _ from "lodash";

export default (params) => async (req, __, next) => {
  const token = req.headers.token || req.query.token;
  if (!token) {
    throw new InvalidTokenError("Token is required");
  }
  const params = {
    query_name: "fetchTokenData",
    token,
  };
  const tokenData = await databaseServiceInterceptor(params, "db");

  if (_.isEmpty(tokenData)) {
    throw new InvalidTokenError("Invalid Token");
  }

  req.context = tokenData;

  next();
};
