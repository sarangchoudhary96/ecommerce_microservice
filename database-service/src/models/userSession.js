import Sequelize from "sequelize";

const UserSession = (seq) =>
  seq.define(
    "user_session",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: Sequelize.INTEGER,
      visitor_id: Sequelize.INTEGER,
    },
    {
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: false,
    }
  );

export const makeAssociations = (models) => {
  const { UserSessionModel, UserModel } = models;
  UserSessionModel.belongsTo(UserModel, {
    foreignKey: "user_id",
  });
};
export default UserSession;
