import express from "express";
import { v1 as uuidv1 } from "uuid";
import { databaseServiceInterceptor } from "../../utils/interceptor";
import asyncHandler from "../../utils/errorWrapper";
import _ from "lodash";
import { decrypt, encrypt } from "../encryption";
import config from "../../../config";
import { MessageError } from "../../utils/error";

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
  asyncHandler(async (req, res) => {
    const { username, password, id: visitor_id } = req.body;
    const checkUserExist = await databaseServiceInterceptor(
      {
        query_name: "fetchUserInfo",
        username,
      },
      "db"
    );

    if (_.isEmpty(checkUserExist)) {
      throw new MessageError("Invalid Username or Password");
    }

    const decryptedPassword = passwordDecrypt(checkUserExist.password);

    if (password != decryptedPassword) {
      throw new MessageError("Invalid Username or Password");
    }
    const params = {
      query_name: "createSession",
      user_id: checkUserExist.id,
      visitor_id,
    };
    const response = await databaseServiceInterceptor(params, "db");

    res.create(response).success().send();
  })
);

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, username, password, gender, email, contact } = req.body;
    const encryptedPassword = passwordEncrypt(password);
    const params = {
      query_name: "userRegister",
      infoData: {
        name,
        username,
        password: encryptedPassword,
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
