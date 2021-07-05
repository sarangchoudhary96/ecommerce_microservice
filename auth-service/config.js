export const config = {
  // eslint-disable-next-line no-undef
  port: process.env.PORT || 8002,
  passwordEncryption: {
    secret: "664c454d90595d118fa1d75768241f64",
    algorithm: "aes-256-cbc",
  },
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
  fromEmails: {
    userRegister: {
      from: "plenty100000@gmail.com",
      fromName: "ecommerce_app",
    },
    userLogin: {
      from: "plenty100000@gmail.com",
      fromName: "ecommerce_app",
    },
    userLogout: {
      from: "plenty100000@gmail.com",
      fromName: "ecommerce_app",
    },
    forgetpassword: {
      from: "plenty100000@gmail.com",
      fromName: "ecommerce_app",
    },
  },
  emailTemplates: {
    userRegister: {
      subject: "User Registration",
      text: "<h1>Your account has been successfully created</h1>",
    },
    userLogin: {
      subject: "Login Alert",
      text: "<h1>Login Successful</h1>",
    },
    userLogout: {
      subject: "Logout Alert",
      text: "<h1>Logout Successful</h1>",
    },
    forgetpassword: {
      subject: "Reset Password",
      text: `<h1>Reset password using below given link</h1>
             <h3>If this is not you, ignore this email</h3>
             <p>click <a href="https://www.w3schools.com/">here</a> to reset your password</p>`,
    },
  },
};
