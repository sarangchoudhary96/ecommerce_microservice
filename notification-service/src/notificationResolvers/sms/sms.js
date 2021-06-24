export const smsHandler = (amqpConnection, queue, exchange) => {
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
            const x = msg.content.toString();
            console.log(x);
            channel.ack(msg);
          },
          { noAck: false }
        )
      )
  );
};
