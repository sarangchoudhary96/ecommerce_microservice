import { BadRequestError } from "../utils/error";
import _ from "lodash";

const tranformToErrorsArray = (errorsObj) =>
  errorsObj.details.map((error) => error.message);

export default async (itemsToValidate, rulesForValidaton) => {
  const options = { abortEarly: false };
  const validationsResult = rulesForValidaton.validate(
    itemsToValidate,
    options
  );

  if (_.get(validationsResult, "error") === undefined) return true;

  throw new BadRequestError(
    "Bad Request",
    tranformToErrorsArray(validationsResult.error)
  );
};
