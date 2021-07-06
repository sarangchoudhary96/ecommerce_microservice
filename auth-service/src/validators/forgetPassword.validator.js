import Joi from "joi";
import requestValidator from "./requestValidator";
import _ from "lodash";

export default async (req, __, next) => {
  const itemsToValidate = {
    user_input: _.get(req, "body.user_input", ""),
  };

  const rulesForValidation = Joi.object({
    user_input: Joi.string().required(),
  });

  requestValidator(itemsToValidate, rulesForValidation)
    .then((__) => next())
    .catch(next);
};
