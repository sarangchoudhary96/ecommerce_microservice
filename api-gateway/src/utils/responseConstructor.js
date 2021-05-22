export default (app, redisConnect) => {
  redisConnect.on("connect", () => {
    console.log("redis client connected");
  });
  redisConnect.on("error", (err) => {
    console.log("error occured", err);
  });
  app.use((_, res, next) => {
    res.locals.redisConnection = redisConnect;
    next();
  });
};
