import Joi from "joi";
import requestValidator from "./requestValidator";

export default async (req, __, next) => {
  const itemsToValidate = {
    username: req.body.username,
    password: req.body.password,
  };

  const rulesForValidation = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });

  requestValidator(itemsToValidate, rulesForValidation)
    .then((__) => next())
    .catch(next);
};
