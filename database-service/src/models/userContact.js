import Sequelize from "sequelize";

const UserContact = (seq) =>
  seq.define(
    "user_contact",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: Sequelize.STRING,
      user_id: Sequelize.INTEGER,
      contact_number: Sequelize.STRING,
      is_verified: Sequelize.INTEGER,
    },
    {
      freezeTableName: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: false,
    }
  );

export default UserContact;
