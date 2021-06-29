import express from "express";
import { config } from "./config";
import { connectToRMQ } from "./src/utils/amqpConnection";
import { consumeOrder } from "./src/utils/consumeOrder";

const { QUEUE_ORDER } = config.rabbitMQ.queues;
const { EXCHANGE_ORDER } = config.rabbitMQ.exchanges;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function main() {
  const amqpConnection = await connectToRMQ();
  consumeOrder(amqpConnection, QUEUE_ORDER, EXCHANGE_ORDER);

  app.listen(config.port, (err) => {
    if (err) {
      console.log("something went wrong", err);
      return;
    }
    console.log("Order-Server started on port number", config.port);
  });
}

main().catch((err) => console.log(err));
