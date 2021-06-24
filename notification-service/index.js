import express from "express";
import { config } from "./config";
import { connectToRMQ } from "./src/utils/amqpConnection";
import { execNotifyHandlers } from "./src/notificationResolvers";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function main() {
  const amqpConnection = await connectToRMQ();
  execNotifyHandlers(amqpConnection);

  app.listen(config.port, (err) => {
    if (err) {
      /*eslint-disable*/
      console.log("something went wrong", err);
      return;
    }
    console.log("Notification-Server started on port number", config.port);
  });
}

main().catch((err) => console.log(err));
