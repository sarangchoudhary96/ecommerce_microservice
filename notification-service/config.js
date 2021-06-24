export const config = {
  // eslint-disable-next-line no-undef
  port: process.env.PORT || 8005,
  rabbitMQ: {
    queues: {
      QUEUE_SMS: "SMS",
      QUEUE_EMAIL: "EMAIL",
    },
    exchanges: {
      EXCHANGE_SMS: "SMS_XCHANGE",
      EXCHANGE_EMAIL: "EMAIL_XCHANGE",
    },
  },
};
