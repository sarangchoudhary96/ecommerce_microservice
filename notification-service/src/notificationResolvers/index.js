import { emailHandler } from "./email/email";
import { smsHandler } from "./sms/sms";
import { config } from "../../config";
const { QUEUE_EMAIL, QUEUE_SMS } = config.rabbitMQ.queues;
const { EXCHANGE_EMAIL, EXCHANGE_SMS } = config.rabbitMQ.exchanges;

export const execNotifyHandlers = (amqpConnection) => {
  Promise.all([
    emailHandler(amqpConnection, QUEUE_EMAIL, EXCHANGE_EMAIL),
    smsHandler(amqpConnection, QUEUE_SMS, EXCHANGE_SMS),
  ]);
};
