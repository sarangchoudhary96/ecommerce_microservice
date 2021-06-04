import merge from "deepmerge";

import productResolver from "./products.resolvers";
import UserResolver from "./user.resolver";
import VisitorResolver from "./visitor.resolver";

export default merge.all([productResolver, UserResolver, VisitorResolver]);
