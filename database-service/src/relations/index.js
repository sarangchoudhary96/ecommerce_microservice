export const buildDBAssociations = (models) => {
  require("../models/user").makeAssociations(models);
  require("../models/userSession").makeAssociations(models);
};
