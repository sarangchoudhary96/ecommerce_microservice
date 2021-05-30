import User from "./user";
import UserEmail from "./userEmail";
import UserContact from "./userContact";
import UserSession from "./userSession";
import Visitor from "./visitor";

export default (sequelize) => {
  const UserModel = User(sequelize);
  const UserEmailModel = UserEmail(sequelize);
  const UserContactModel = UserContact(sequelize);
  const UserSessionModel = UserSession(sequelize);
  const VisitorModel = Visitor(sequelize);

  return {
    UserModel,
    UserEmailModel,
    UserContactModel,
    UserSessionModel,
    VisitorModel,
  };
};
