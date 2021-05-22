export default (app, redisConnect) => {
  app.use((_, res, next) => {
    res.locals.redisConnection = redisConnect;
    redisConnect.on("connect", () => {
      console.log("redis client connected");
    });
    next();
  });
};
