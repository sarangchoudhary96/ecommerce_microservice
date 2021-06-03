import express from "express";
import { v1 as uuidv1 } from "uuid";
import { databaseServiceInterceptor } from "../../utils/interceptor";
import asyncHandler from "../../utils/errorWrapper";
import _ from "lodash";

const router = express.Router();

router.post(
  "/login",
  asyncHandler((req, res) => {
    res.create({ auth: "yes" }).success().send();
  })
);

router.post(
  "/register",
  asyncHandler((req, res) => {})
);

router.post(
  "/device/register",
  asyncHandler(async (req, res) => {
    req.body = {
      token: uuidv1({
        clockseq: 0x1234,
        msecs: new Date().getTime(),
        nsecs: 5678,
      }),
      query_name: "deviceRegister",
    };
    const response = await databaseServiceInterceptor(req, "db");
    const token = _.get(response, "token");
    res.create({ token }).success().send();
  })
);

export default router;
