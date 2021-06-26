import { QueryIncompletionError } from "../utils/errors";
import _ from "lodash";

export default {
  Query: {
    fetchUserEmailInfo: async ({ sequelize }, { params, models }) => {
      const { UserEmailModel } = models;
      const { user_id } = params;
      return UserEmailModel.findOne({ where: user_id }).catch((e) => {
        throw new QueryIncompletionError(e);
      });
    },
  },
  Mutation: {},
};
