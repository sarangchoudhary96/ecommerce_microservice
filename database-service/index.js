import express from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";
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
  QueryIncompletionErrorResolver,
} from "./src/utils/errors";
import asyncHandler from "./src/utils/errorWrapper";
import resolvers from "./src/resolvers";
import models from "./src/models";
import _ from "lodash";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  {
    flags: "a",
  }
);

app.use(morgan("combined", { stream: accessLogStream }));
app.use(morgan("dev"));

const builtModels = models(sequelize);

upgradeResponse(app);

require("./src/relations").buildDBAssociations(builtModels);

app.post(
  "/db",
  asyncHandler(async (req, res) => {
    const queryName = _.get(
      req,
      "query.query_name",
      _.get(req, "body.query_name", "")
    );
    const resolver = _.get(
      resolvers,
      `Query.${[queryName]}`,
      _.get(resolvers, `Mutations.${[queryName]}`)
    );
    const response = await resolver(
      { sequelize },
      {
        params: req.body,
        models: builtModels,
      }
    );
    res.json(response);
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
  unknownRouteErrorResolver,
  QueryIncompletionErrorResolver
);

app.listen(config.port, (err) => {
  if (err) {
    console.log("something went wrong", err);
    return;
  }
  console.log("Database-Server started on port number", config.port);
});
