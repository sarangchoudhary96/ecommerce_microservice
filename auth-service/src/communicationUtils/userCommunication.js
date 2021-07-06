import { config } from "../../config";
import { publishEmail } from "../utils/amqpPublisher";

export const sendEmailToUser = async (amqp, userEmail, emailType) => {
  const emailData = {
    to: [userEmail],
    from: _.get(config, `fromEmails.${emailType}.from`),
    from_name: _.get(config, `fromEmails.${emailType}.fromName`),
    subject: _.get(config, `emailTemplates.${emailType}.subject`),
    html: _.get(config, `emailTemplates.${emailType}.text`),
  };
  await publishEmail(amqp, emailData);
};
