import Joi from "joi";

export const emailBodyValidator = Joi.object({
  to: Joi.array().items(Joi.string().email()).required(),
  from: Joi.string().email().required(),
  from_name: Joi.string().required(),
  subject: Joi.string(),
  cc: Joi.array().items(Joi.string().email()),
  bcc: Joi.array().items(Joi.string().email()),
  text: Joi.string(),
  html: Joi.string(),
}).xor("text", "html");
