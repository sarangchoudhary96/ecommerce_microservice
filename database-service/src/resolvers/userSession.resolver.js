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
          return { message: "Login Successfull" };
        })
        .catch((e) => {
          throw new QueryIncompletionError(e);
        });
    },
  },
};
