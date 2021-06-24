import express from "express";
import v1routes from "./src/routes/v1/routes";
import v2routes from "./src/routes/v2/routes";
import {
  InternalServerErrorResolver,
  NoDataErrorResolver,
  ForbiddenErrorResolver,
  MessageErrorResolver,
  InvalidTokenErrorResolver,
  BadRequestErrorResolver,
  UnauthorisedErrorResolver,
  unknownRouteErrorResolver,
  byPassErrorResolver,
} from "./src/utils/error";
import { config } from "./config";
import upgradeResponse from "./src/utils/responseConstructor";
import { connectToRMQ } from "./src/utils/amqpConnection";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function main() {
  const amqpConnection = await connectToRMQ();

  upgradeResponse(app, amqpConnection);

  app.use("/auth/v1", v1routes);
  app.use("/auth/v2", v2routes); // for upgraded version APIs

  app.use(
    InternalServerErrorResolver,
    NoDataErrorResolver,
    ForbiddenErrorResolver,
    MessageErrorResolver,
    InvalidTokenErrorResolver,
    BadRequestErrorResolver,
    UnauthorisedErrorResolver,
    unknownRouteErrorResolver,
    byPassErrorResolver
  );

  app.listen(config.port, (err) => {
    if (err) {
      console.log("something went wrong", err);
      return;
    }
    console.log("Auth-Server started on port number", config.port);
  });
}

main().catch((err) => console.log(err));
