export class InternalServerError extends Error {
  constructor(message, data) {
    super();
    this.message = message || "Internal Server Error";
    this.data = data;
  }
}

export const InternalServerErrorResolver = (err, req, res, next) => {
  if (err instanceof InternalServerError) {
    res.create(err).internalerror(err.message, 500).send();
    return;
  }
  next(err);
};

export class NoDataError extends Error {}

export const NoDataErrorResolver = (err, req, res, next) => {
  if (err instanceof NoDataError) {
    res.create().nodata().send();
    return;
  }
  next(err);
};

export class ForbiddenError extends Error {
  constructor(msg, errors) {
    super();
    this.message = msg || "Forbidden";
    this.errors = errors;
  }
}

export const ForbiddenErrorResolver = (err, req, res, next) => {
  if (err instanceof ForbiddenError) {
    res.create(err.errors).forbidden(err.message).send();
    return;
  }
  next(err);
};

export class MessageError extends Error {
  constructor(message, errors) {
    super();
    this.message = message || "Some Error Occurred";
    this.errors = errors;
  }
}

export const MessageErrorResolver = (err, req, res, next) => {
  if (err instanceof MessageError) {
    res.create(err.errors).unprocessable(err.message, 422, err.errors).send();
    return;
  }
  next(err);
};

export class InvalidTokenError extends Error {
  constructor(msg, errors) {
    super();
    this.message = msg || "Invalid Token";
    this.errors = errors;
  }
}

export const InvalidTokenErrorResolver = (err, req, res, next) => {
  if (err instanceof InvalidTokenError) {
    res
      .create(err.errors)
      .invalidToken("Invalid Token: " + err.message, 498)
      .send();
    return;
  }
  next(err);
};

export class BadRequestError extends Error {
  constructor(msg, errors) {
    super();
    this.message = msg || "Bad Request";
    this.errors = errors;
  }
}

export const BadRequestErrorResolver = (err, req, res, next) => {
  if (err instanceof BadRequestError) {
    res.create(err.errors).badrequest(err.message, 400, err.errors).send();
    return;
  }
  next(err);
};

export class UnauthorisedError extends Error {
  constructor(msg, errors) {
    super();
    this.message = msg || "Unauthorised";
    this.errors = errors;
  }
}

export const UnauthorisedErrorResolver = (err, req, res, next) => {
  if (err instanceof UnauthorisedError) {
    res
      .create(err.errors)
      .unauthorised("Unauthorised Error:" + err.message, 401)
      .send();
    return;
  }
  next(err);
};

export class UnknownRouteError extends Error {
  constructor(msg, errors) {
    super();
    this.message = msg || "Unauthorised";
    this.errors = errors;
  }
}

export const unknownRouteErrorResolver = (err, req, res, next) => {
  if (err instanceof UnknownRouteError) {
    res.create(err.errors).notFound(err.message).send();
    return;
  }
  next(err);
};

export class byPassError extends Error {
  constructor(msg, error_code, errors) {
    super();
    this.message = msg;
    this.errors = errors;
    this.error_code = error_code;
  }
}

export const byPassErrorResolver = (err, req, res, next) => {
  if (err instanceof byPassError) {
    res.create().byPassed(err.message, err.error_code, err.errors).send();
    return;
  }
  next(err);
};
