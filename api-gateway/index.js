import express from "express";
import config from "./src/config";
import tokenValidator from "./src/utils/tokenValidator";
import circuitBreaker from "./src/utils/circuitBreaker";
import routes from "./src/routes/routes";
import upgradeResponse from "./src/utils/responseConstructor";
import redisClient from "./src/client";
import {
  InternalServerErrorResolver,
  NoDataErrorResolver,
  ForbiddenErrorResolver,
  MessageErrorResolver,
  InvalidTokenErrorResolver,
  BadRequestErrorResolver,
  UnauthorisedErrorResolver,
  unknownRouteErrorResolver,
} from "./src/utils/errors";
import asyncHandler from "./src/utils/errorWrapper";
import { byPassRoutes } from "./src/utils/commonHelpers";
import { pathToBeIgnoredForTokenValidation } from "./src/routes/routesConstants";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

upgradeResponse(app, redisClient());

app.use("*", (req, res, next) => {
  byPassRoutes(
    asyncHandler(tokenValidator({})),
    pathToBeIgnoredForTokenValidation
  )(req, res, next);
});

app.use("*", (req, res, next) => {
  asyncHandler(circuitBreaker({}))(req, res, next);
});

app.get("/api/apigateway", (req, res) => {
  res.create("Gateway server working fine").success().send(); // just to check gateway is working
});

// const router = express.Router({ strict: true });

app.use((req, res, next) => {
  req.url = "/api";
  next("route");
});

app.use("/", routes);

app.use(
  InternalServerErrorResolver,
  NoDataErrorResolver,
  ForbiddenErrorResolver,
  MessageErrorResolver,
  InvalidTokenErrorResolver,
  BadRequestErrorResolver,
  UnauthorisedErrorResolver,
  unknownRouteErrorResolver
);

app.listen(config.port, (err) => {
  if (err) {
    console.log("something went wrong", err);
    return;
  }
  console.log("Gateway-Server started on port number", config.port);
});
