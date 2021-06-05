import { QueryIncompletionError } from "../utils/errors";
import _ from "lodash";

export default {
  Query: {
    fetchUserInfo: async ({ sequelize }, { params, models }) => {
      const { UserModel } = models;
      const { username } = params;
      return UserModel.findOne({ where: { username } }).catch((e) => {
        throw new QueryIncompletionError(e);
      });
    },
  },

  Mutations: {
    userRegister: async ({ sequelize }, { params, models }) => {
      const { UserModel, UserContactModel, UserEmailModel } = models;
      const { infoData, contactData } = params;

      return sequelize
        .transaction(async (transaction) => {
          const checkUserExist = await UserModel.findOne({
            where: { username: _.get(infoData, "username") },
          });

          if (!_.isEmpty(checkUserExist)) {
            throw new QueryIncompletionError("username already exist");
          }

          const userInfo = await UserModel.create(
            { ...infoData },
            { transaction }
          );

          if (_.get(contactData, "email")) {
            // check if email is provided
            const checkEmailExist = await UserEmailModel.findOne({
              where: { email: _.get(contactData, "email") },
            });

            if (!_.isEmpty(checkEmailExist)) {
              throw new QueryIncompletionError("email already exist");
            }

            await UserEmailModel.create(
              {
                user_id: userInfo.dataValues.id,
                email: _.get(contactData, "email"),
                is_verified: 0,
              },
              { transaction }
            );
          } else if (_.get(contactData, "contact")) {
            // else if contact number is provided
            const checkContactExist = await UserContactModel.findOne({
              where: { contact_number: _.get(contactData, "contact") },
            });

            if (!_.isEmpty(checkContactExist)) {
              throw new QueryIncompletionError("contact number already exist");
            }

            await UserContactModel.create(
              {
                user_id: userInfo.id,
                contact_number: _.get(contactData, "contact"),
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
