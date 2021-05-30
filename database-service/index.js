import express from "express";
import sequelize from "./dbDriver";
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
import models from "./src/models";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const builtModels = models(sequelize);

upgradeResponse(app);

app.post(
  "/db",
  asyncHandler((req, res) => {
    const data = resolvers.Query[req.query.query_name](
      { sequelize },
      {
        params: req.body,
        models: builtModels,
      }
    );
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
