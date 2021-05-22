const config = {
  port: process.env.PORT || 8000,
  circuitBreakerCacheKey: (serviceName) => {
    `${serviceName}-threshold`;
  },
  circuitBreakerThresholdValues: {
    product: 10,
    auth: 10,
  },
};

export default config;
