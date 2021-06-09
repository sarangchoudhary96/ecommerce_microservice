import { BadRequestError } from "../utils/error";

const tranformToErrorsArray = (errorsObj) =>
  errorsObj.details.map((error) => error.message);

export default async (itemsToValidate, rulesForValidaton) => {
  const options = { abortEarly: false };
  const validationsResult = rulesForValidaton.validate(
    itemsToValidate,
    options
  );

  if (validationsResult.error === null) return true;

  throw new BadRequestError(
    "Bad Request",
    tranformToErrorsArray(validationsResult.error)
  );
};
