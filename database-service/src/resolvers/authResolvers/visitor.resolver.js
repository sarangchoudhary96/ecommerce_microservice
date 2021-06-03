import { QueryIncompletionError } from "../../utils/errors";

export default {
  Query: {},

  Mutations: {
    deviceRegister: async ({ sequelize }, { params, models }) => {
      const { VisitorModel } = models;
      return sequelize
        .transaction((transaction) =>
          VisitorModel.create({ token: params.token }, { transaction })
        )
        .then((x) => x || true)
        .catch((e) => {
          throw new QueryIncompletionError(e);
        });
    },
  },
};
