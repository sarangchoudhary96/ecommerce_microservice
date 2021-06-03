import merge from "deepmerge";

import loginResolver from "./authResolvers/login.resolver";
import productResolver from "./productResolver/products.resolvers";
import UserResolver from "./apiGatewayResolvers/user.resolver";
import VisitorResolver from "./authResolvers/visitor.resolver";

export default merge.all([
  loginResolver,
  productResolver,
  UserResolver,
  VisitorResolver,
]);
