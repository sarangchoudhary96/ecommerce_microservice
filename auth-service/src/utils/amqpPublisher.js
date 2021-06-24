import _ from "lodash";
import { config } from "../../config";
import { emailBodyValidator } from "./amqpSchemaValidator";

const { QUEUE_EMAIL, QUEUE_SMS } = config.rabbitMQ.queues;
const { EXCHANGE_EMAIL, EXCHANGE_SMS } = config.rabbitMQ.exchanges;

const pushDataToQueue = (amqpConn, queue, exchange, data) => {
  amqpConn
    .createChannel()
    .then((channel) =>
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
          // eslint-disable-next-line no-undef
          channel.publish(exchange, queue, Buffer.from(JSON.stringify(data)))
        )
        .then((_) =>
          // eslint-disable-next-line no-console
          console.log({
            message: `Data Pushed to Queue: ${queue} ::: ${JSON.stringify(
              data
            )}`,
          })
        )
        .then((_) => channel.close())
    )
    .catch((err) => {
      throw new Error(`Unable to Push Data To Queue ${err}`);
    });
};

export const publishEmail = async (amqpConnection, emailReqData) => {
  const validateResult = emailBodyValidator.validate(emailReqData);
  if (_.get(validateResult, "error") !== undefined) {
    throw validateResult.error;
  } else {
    return pushDataToQueue(
      amqpConnection,
      QUEUE_EMAIL,
      EXCHANGE_EMAIL,
      emailReqData
    );
  }
};

export const publishSMS = async (amqpConnection, smsReqData) => {};
