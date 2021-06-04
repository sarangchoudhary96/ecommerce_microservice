import { QueryIncompletionError } from "../utils/errors";

export default {
  Query: {
    fetchTokenData: async ({ sequelize }, { params, models }) => {
      const { UserModel, UserSessionModel, VisitorModel } = models;
      const { token } = params;
      return VisitorModel.findOne({
        include: [
          {
            model: UserSessionModel,
            required: false,
            include: [
              {
                model: UserModel,
                required: false,
              },
            ],
          },
        ],
        where: { token },
      }).catch((e) => {
        throw new QueryIncompletionError(e);
      });
    },
  },

  Mutations: {
    deviceRegister: async ({ sequelize }, { params, models }) => {
      const { VisitorModel } = models;
      return sequelize
        .transaction((transaction) =>
          VisitorModel.create({ token: params.token }, { transaction })
        )
        .then((x) => x)
        .catch((e) => {
          throw new QueryIncompletionError(e);
        });
    },
  },
};
