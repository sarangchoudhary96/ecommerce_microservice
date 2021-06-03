import { QueryIncompletionError } from "../../utils/errors";

export default {
  Query: {
    fetchTokenData: async ({ sequelize }, { params, models }) => {
      const { UserModel, UserSessionModel, VisitorModel } = models;
      const { token } = params;
      return UserModel.findAll({
        include: [
          {
            model: UserSessionModel,
            required: false,
            include: [
              {
                model: VisitorModel,
                required: false,
                where: { token },
              },
            ],
          },
        ],
      }).catch((e) => {
        throw new QueryIncompletionError(e);
      });
    },
  },

  Mutations: {},
};
