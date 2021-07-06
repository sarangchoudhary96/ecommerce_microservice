import Joi from "joi";
import requestValidator from "./requestValidator";
import _ from "lodash";

export default async (req, __, next) => {
  const itemsToValidate = {
    password: _.get(req, "body.password", ""),
    confirmation_token: _.get(req, "body.confirmation_token", ""),
  };

  const rulesForValidation = Joi.object({
    password: Joi.string().required(),
    confirmation_token: Joi.string().required(),
  });

  requestValidator(itemsToValidate, rulesForValidation)
    .then((__) => next())
    .catch(next);
};
