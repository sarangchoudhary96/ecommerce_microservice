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

export default Visitor;
