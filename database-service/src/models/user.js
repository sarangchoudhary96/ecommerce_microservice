import Sequelize from "sequelize";

const User = (seq) =>
  seq.define(
    "user",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: Sequelize.STRING,
      username: Sequelize.STRING,
      password: Sequelize.STRING,
      gender: Sequelize.STRING,
      status: Sequelize.INTEGER,
      confirmation_token: Sequelize.INTEGER,
    },
    {
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: false,
    }
  );

export const makeAssociations = (models) => {
  const { UserModel, UserEmailModel } = models;

  UserModel.hasOne(UserEmailModel, {
    foreignKey: "user_id",
  });
};

export default User;
