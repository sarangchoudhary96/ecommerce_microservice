import { order } from "../resolvers/order";

export const consumeOrder = (amqpConnection, queue, exchange) => {
  amqpConnection.createChannel().then((channel) =>
    channel
      .assertQueue(queue, { durable: false, autoDelete: false })
      .then((_) =>
        Promise.all([
          channel.assertExchange(exchange, "direct", {
            durable: true,
            autoDelete: false,
          }),
          channel.bindQueue(queue, exchange, queue),
        ])
      )
      .then((_) =>
        channel.consume(
          queue,
          (msg) => {
            order(JSON.parse(msg.content.toString()));
            channel.ack(msg);
          },
          { noAck: false }
        )
      )
  );
};
