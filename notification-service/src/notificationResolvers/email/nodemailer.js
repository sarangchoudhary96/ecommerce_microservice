import nodemailer from "nodemailer";

export const sendEmail = async ({ emailPayload }) => {
  const { to, from, from_name, text, html, subject } = emailPayload;

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: from,
      pass: "",
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  var mailOptions = {
    from: `"${from_name}" ${from}`,
    to: `${to.toString()}`,
    subject,
    text,
    html,
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      /*eslint-disable*/
      console.log(err);
    } else {
      console.log("Email sent: %s", response.messageId);
    }
  });
};
