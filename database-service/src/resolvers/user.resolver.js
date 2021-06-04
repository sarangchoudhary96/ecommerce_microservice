import { QueryIncompletionError } from "../utils/errors";
import _ from "lodash";

export default {
  Query: {},

  Mutations: {
    userRegister: async ({ sequelize }, { params, models }) => {
      const { UserModel, UserContactModel, UserEmailModel } = models;
      const { infoData, contactData } = params;
      return sequelize
        .transaction(async (transaction) => {
          const userInfo = await UserModel.create(
            { ...infoData },
            { transaction }
          );

          if (_.get(contactData, "email")) {
            await UserEmailModel.create(
              {
                user_id: userInfo.dataValues.id,
                email: _.get(contactData, "email"),
                is_verified: 0,
              },
              { transaction }
            );
          } else if (_.get(contactData, "contact")) {
            await UserContactModel.create(
              {
                user_id: userInfo.id,
                email: _.get(contactData, "contact"),
                is_verified: 0,
              },
              { transaction }
            );
          }

          return { status: true };
        })
        .catch((e) => {
          throw new QueryIncompletionError(e);
        });
    },
  },
};
