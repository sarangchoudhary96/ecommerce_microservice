import merge from "deepmerge";

import productResolver from "./products.resolvers";
import UserResolver from "./user.resolver";
import VisitorResolver from "./visitor.resolver";
import UserSessionResolver from "./userSession.resolver";
import userEmailResolver from "./userEmail.resolver";

export default merge.all([
  productResolver,
  UserResolver,
  VisitorResolver,
  UserSessionResolver,
  userEmailResolver,
]);
