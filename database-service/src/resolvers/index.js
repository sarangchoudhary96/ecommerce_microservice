import merge from "deepmerge";

import loginResolver from "./authResolvers/login.resolver";
import productResolver from "./productResolver/products.resolvers";

export default merge.all([loginResolver, productResolver]);
