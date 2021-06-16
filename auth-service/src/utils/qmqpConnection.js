import amqp from "amqplib";

export const amqpServerUrl = "amqp://localhost";
export const connectToRMQ = () =>
  amqp.connect("amqp://localhost", (err, conn) => {
    if (err) {
      throw new Error(`Error Connecting to AMQP Server ${err}`);
    }
    console.log("AMQP Connection Ready"); // eslint-disable-line
    return conn;
  });
