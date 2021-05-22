const config = {
  port: process.env.PORT || 8000,
  circuitBreakerCacheKey: (serviceName) => `${serviceName}-threshold`,
  circuitBreakerThresholdValues: {
    product: 10,
    auth: 10,
  },
  redisConfig: {
    PORT: 6379,
    HOST: "localhost",
    PASSWORD: "",
  },
};

export default config;
