import Sequelize from "sequelize";

const Visitor = (seq) =>
  seq.define(
    "visitor",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      token: Sequelize.STRING,
    },
    {
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: false,
    }
  );

export const makeAssociations = (models) => {
  const { UserSessionModel, VisitorModel } = models;
  VisitorModel.hasOne(UserSessionModel, {
    foreignKey: "visitor_id",
  });
};

export default Visitor;
