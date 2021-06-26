import { sendEmail } from "./nodemailer";

export const emailHandler = (amqpConnection, queue, exchange) => {
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
            sendEmail({ emailPayload: JSON.parse(msg.content.toString()) });
            channel.ack(msg);
          },
          { noAck: false }
        )
      )
  );
};
