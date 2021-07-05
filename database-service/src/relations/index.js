/* eslint-disable no-undef */
export const buildDBAssociations = (models) => {
  require("../models/userSession").makeAssociations(models);
  require("../models/visitor").makeAssociations(models);
  require("../models/user").makeAssociations(models);
};
