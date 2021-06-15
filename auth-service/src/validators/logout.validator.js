import Joi from "joi";
import requestValidator from "./requestValidator";
import _ from "lodash";

export default async (req, __, next) => {
  const itemsToValidate = {
    session_id: Number(_.get(req, "body.user_session.id", "")),
  };

  const rulesForValidation = Joi.object({
    session_id: Joi.number().required(),
  });

  requestValidator(itemsToValidate, rulesForValidation)
    .then((__) => next())
    .catch(next);
};
