export const config = {
  // eslint-disable-next-line no-undef
  port: process.env.port || 8006,
  rabbitMQ: {
    queues: {
      QUEUE_ORDER: "ORDER",
      QUEUE_PRODUCT: "PRODUCT",
    },
    exchanges: {
      EXCHANGE_ORDER: "ORDER_XCHANGE",
      EXCHANGE_PRODUCT: "PRODUCT_XCHANGE",
    },
  },
};
