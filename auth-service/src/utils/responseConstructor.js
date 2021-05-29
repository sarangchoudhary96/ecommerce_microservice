import _ from "lodash";

class Response {
  constructor(data, message, status) {
    this.message = message;
    this.status = status;
    this.data = data;
    this.res = null;
  }

  eligibleProperties = [
    "data",
    "successMessage",
    "errorMessage",
    "errorCode",
    "errors",
    "status",
  ];

  captureOrignalResponse(res) {
    this.res = res;
    return;
  }

  success(message) {
    this.res.status(200);
    this.successMessage = message || "Success";
    return this;
  }

  send() {
    if (!this.res.json) {
      throw new Error("Cannot Call send Response before create");
    }
    this.res.json(_.pick(this, this.eligibleProperties));
  }

  invalidToken(errorMsg) {
    this.res.status(498);
    this.errorMessage = errorMsg || "Invalid Token";
    this.errorCode = 498;
    return this;
  }

  internalerror(errorMsg) {
    this.res.status(500);
    this.errorMessage = errorMsg || "Internal Server Error";
    this.errorCode = 500;
    delete this.data;
    return this;
  }

  nodata() {
    this.res.status(204);
    delete this.data;
    return this;
  }

  forbidden(errorMsg) {
    this.res.status(403);
    this.errorMessage = errorMsg || "Not Allowed";
    this.errorCode = 403;
    delete this.data;
    return this;
  }

  notFound(errorMsg) {
    this.res.status(404);
    this.errorMessage = errorMsg || "Route not found";
    this.errorCode = 404;
    delete this.data;
    return this;
  }

  unprocessable(errorMsg, code = 422, errors) {
    this.res.status(code);
    this.errorMessage =
      errorMsg ||
      "Unprocessable Entity: Args passed are not as per requirements";
    this.errorCode = code;
    this.errors = errors || [];
    delete this.data;
    return this;
  }

  badrequest(errorMsg, code, errors) {
    this.res.status(400);
    this.errorMessage =
      (errorMsg && errorMsg.startsWith("Error:")
        ? errorMsg.replace("Error:", "")
        : errorMsg) || "Bad Request";
    this.errorCode = code || 400;
    this.errors = errors || [];
    delete this.data;
    return this;
  }

  unauthorised(errorMsg) {
    this.res.status(401);
    this.errorMessage = errorMsg || "Not Allowed";
    this.errorCode = 401;
    delete this.data;
    return this;
  }
}

export default (app) => {
  return app.use((_, res, next) => {
    res.create = (data) => {
      const response = new Response(data);
      response.captureOrignalResponse(res);
      return response;
    };
    next();
  });
};
