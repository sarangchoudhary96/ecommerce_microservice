import express from "express";
import { v1 as uuidv1 } from "uuid";
import { databaseServiceInterceptor } from "../../utils/interceptor";
import asyncHandler from "../../utils/errorWrapper";
import _ from "lodash";
import { decrypt, encrypt } from "../encryption";
import config from "../../../config";

const secret = _.get(config, "passwordEncryption.secret", "");
const router = express.Router();

const passwordDecrypt = (password) => {
  return decrypt({ password, secret });
};

const passwordEncrypt = (password) => {
  return encrypt({ password, secret });
};

router.post(
  "/login",
  asyncHandler((req, res) => {
    const { username, password } = req.body;
    const encryptedPassword = passwordDecrypt(password);

    const params = { username, password: encryptedPassword };
    // const response = databaseServiceInterceptor(params, "db");

    res.create({ encryptedPassword }).success().send();
  })
);

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, username, password, gender, email, contact } = req.body;
    const decryptedPassword = passwordEncrypt(password);
    const params = {
      query_name: "userRegister",
      infoData: {
        name,
        username,
        password: decryptedPassword,
        gender,
        status: 1,
      },
      contactData: { email, contact },
    };
    const response = await databaseServiceInterceptor(params, "db");

    res.create(response).success().send();
  })
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
