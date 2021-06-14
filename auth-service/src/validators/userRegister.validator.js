import Joi from "joi";
import requestValidator from "./requestValidator";

export default async (req, __, next) => {
  const itemsToValidate = {
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    gender: req.body.gender,
    contact: req.body.contact,
  };

  const rulesForValidation = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
    gender: Joi.string().required(),
    contact: Joi.string(),
    email: Joi.string(),
  }).xor("contact", "email");

  requestValidator(itemsToValidate, rulesForValidation)
    .then((__) => next())
    .catch(next);
};
