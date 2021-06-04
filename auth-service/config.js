const config = {
  port: process.env.PORT || 8002,
  passwordEncryption: {
    secret: "664c454d90595d118fa1d75768241f64",
    algorithm: "aes-256-cbc",
  },
};

export default config;
