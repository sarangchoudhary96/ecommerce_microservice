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
    },
    {
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: false,
    }
  );

export default User;
