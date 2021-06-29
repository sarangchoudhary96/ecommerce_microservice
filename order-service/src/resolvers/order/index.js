import _ from "lodash";
import { createOrder } from "./createOrder";
import { cancelOrder } from "./cancelOrder";

const orderType = { create: createOrder, cancel: cancelOrder };

export const order = (orderInfo) => {
  orderType[_.get(orderInfo, "orderType")]({ orderInfo });
};
