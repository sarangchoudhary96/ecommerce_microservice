import { databaseServiceInterceptor } from "./interceptor";

export default (params) => (req, _, next) => {
  const token = req.headers.token || req.query.token;

  //   if (!token) {
  //     throw new Error("Unauthenticated Request");
  //   }
  // hit database service with token;
  //   const tokenData = getTokenData(token);

  //   if (!tokenData) {
  //     throw new Error("Invalid Token");
  //   }

  //   req.context = tokenData;

  next();
};
