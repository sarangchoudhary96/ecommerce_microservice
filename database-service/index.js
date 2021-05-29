import express from "express";
import config from "./config";
import upgradeResponse from "./src/utils/responseConstructor";
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
import resolvers from "./src/resolvers";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

upgradeResponse(app);

app.post(
  "/db",
  asyncHandler((req, res) => {
    const data = resolvers.Query[req.query.query_name]({ params: req.body });
    res.json(data);
  })
);

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
  console.log("Server started on port number", config.port);
});
