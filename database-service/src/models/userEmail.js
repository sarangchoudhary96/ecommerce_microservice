import Sequelize from "sequelize";

const UserEmail = (seq) =>
  seq.define(
    "user_email",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: Sequelize.INTEGER,
      email: Sequelize.STRING,
      is_verified: Sequelize.INTEGER,
    },
    {
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: false,
    }
  );

export default UserEmail;
