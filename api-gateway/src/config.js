const config = {
  port: process.env.PORT || 8000,
  redisConfig: {
    PORT: 6379,
    HOST: "localhost",
    PASSWORD: "",
  },
};

export default config;
