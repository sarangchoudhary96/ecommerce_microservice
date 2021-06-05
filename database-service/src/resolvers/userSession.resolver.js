import { QueryIncompletionError } from "../utils/errors";

export default {
  Query: {},

  Mutations: {
    createSession: async ({ sequelize }, { params, models }) => {
      const { user_id, visitor_id } = params;
      const { UserSessionModel } = models;
      return sequelize
        .transaction(async (transaction) => {
          await UserSessionModel.create(
            { user_id, visitor_id },
            { transaction }
          );
          return { message: "Login Successful" };
        })
        .catch((e) => {
          throw new QueryIncompletionError(e);
        });
    },

    deleteSession: async ({ sequelize }, { params, models }) => {
      const { id } = params;
      const { UserSessionModel } = models;
      return sequelize
        .transaction(async (transaction) => {
          await UserSessionModel.destroy({ where: { id } }, { transaction });
          return { message: "Logout Successful" };
        })
        .catch((e) => {
          throw new QueryIncompletionError(e);
        });
    },
  },
};
