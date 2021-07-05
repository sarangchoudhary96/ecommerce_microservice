import crypto from "crypto";
import express from "express";
import { v1 as uuidv1 } from "uuid";
import { databaseServiceInterceptor } from "../../utils/interceptor";
import asyncHandler from "../../utils/errorWrapper";
import _ from "lodash";
import { decrypt, encrypt } from "../../utils/encryption";
import { config } from "../../../config";
import { MessageError } from "../../utils/error";
import userloginValidator from "../../validators/userLogin.validator";
import userRegisterValidator from "../../validators/userRegister.validator";
import logoutValidator from "../../validators/logout.validator";
import { publishEmail } from "../../utils/amqpPublisher";

const secret = _.get(config, "passwordEncryption.secret", "");
const router = express.Router();

const passwordDecrypt = (password) => {
  return decrypt({ password, secret });
};

const passwordEncrypt = (password) => {
  return encrypt({ password, secret });
};

const sendEmailToUser = async (amqp, userEmail, emailType) => {
  const emailData = {
    to: [userEmail],
    from: _.get(config, `fromEmails.${emailType}.from`),
    from_name: _.get(config, `fromEmails.${emailType}.fromName`),
    subject: _.get(config, `emailTemplates.${emailType}.subject`),
    html: _.get(config, `emailTemplates.${emailType}.text`),
  };
  await publishEmail(amqp, emailData);
};

router.post(
  "/user/login",
  userloginValidator,
  asyncHandler(async (req, res) => {
    const amqp = res.create().amqp;
    const { username, password, id: visitor_id } = req.body;
    const checkUserExist = await databaseServiceInterceptor({
      query_name: "fetchUserInfo",
      username,
    });

    if (_.isEmpty(checkUserExist)) {
      throw new MessageError("Invalid Username or Password");
    }
    if (passwordDecrypt(checkUserExist.password) != password) {
      throw new MessageError("Invalid Username or Password");
    }
    const params = {
      query_name: "createSession",
      user_id: checkUserExist.id,
      visitor_id,
    };

    const [loginResponse, userEmailInfo] = await Promise.all([
      databaseServiceInterceptor(params),
      databaseServiceInterceptor({
        id: _.get(checkUserExist, "id"),
        query_name: "fetchUserEmailInfo",
      }),
    ]);

    // send successful login email to user
    _.get(loginResponse, "message") &&
      (await sendEmailToUser(amqp, _.get(userEmailInfo, "email"), "userLogin"));

    res.create(loginResponse).success().send();
  })
);

router.post(
  "/user/register",
  userRegisterValidator,
  asyncHandler(async (req, res) => {
    const amqp = res.create().amqp;
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
    const response = await databaseServiceInterceptor(params);
    const userEmailInfo = await databaseServiceInterceptor({
      id: _.get(response, "user.id"),
      query_name: "fetchUserEmailInfo",
    });

    // send successful registration email to user
    _.get(response, "status") &&
      (await sendEmailToUser(
        amqp,
        _.get(userEmailInfo, "email"),
        "userRegister"
      ));

    res.create(response).success().send();
  })
);

router.post(
  "/user/logout",
  logoutValidator,
  asyncHandler(async (req, res) => {
    const amqp = res.create().amqp;
    const userSessionId = _.get(req, "body.user_session.id", "");
    const [logoutResponse, userEmailInfo] = await Promise.all([
      databaseServiceInterceptor({
        id: userSessionId,
        query_name: "deleteSession",
      }),
      databaseServiceInterceptor({
        id: _.get(req, "body.user_session.user.id"),
        query_name: "fetchUserEmailInfo",
      }),
    ]);

    // send successful logout email to user
    _.get(logoutResponse, "message") &&
      (await sendEmailToUser(
        amqp,
        _.get(userEmailInfo, "email"),
        "userLogout"
      ));
    res.create(logoutResponse).success().send();
  })
);

router.post(
  "/device/register",
  asyncHandler(async (req, res) => {
    const params = {
      token: uuidv1({
        clockseq: 0x1234,
        msecs: new Date().getTime(),
        nsecs: 5678,
      }),
      query_name: "deviceRegister",
    };
    const response = await databaseServiceInterceptor(params);
    const token = _.get(response, "token");
    res.create({ token }).success().send();
  })
);

const isEmail = (email) => {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email));
};

// validator required
router.post(
  "/forget/password",
  asyncHandler(async (req, res) => {
    const amqp = res.create().amqp;
    const { userUniqueKey } = req.body;

    const response = await databaseServiceInterceptor({
      ...(!isEmail(userUniqueKey) && { username: userUniqueKey }),
      ...(isEmail(userUniqueKey) && { useremail: userUniqueKey }),
      query_name: "fetchUserInfoByEmailOruserName",
    });

    if (_.get(response, "id")) {
      // create confirmation token
      await databaseServiceInterceptor({
        query_name: "updateUserConfirmationToken",
        confirmation_token: crypto
          .createHash("md5")
          .update(secret)
          .digest("hex"),
        id: _.get(response, "id"),
      });

      // send email of link to user
      sendEmailToUser(
        amqp,
        _.get(response, "user_email.email"),
        "forgetpassword"
      );
    }

    // final response
    const result = {
      status: !_.isEmpty(response),
      message: _.isEmpty(response)
        ? "user is not registered"
        : "reset link has been sent to your email",
    };

    res.create(result).success().send();
  })
);

// validator required
router.post(
  "/update/password",
  asyncHandler(async (req, res) => {
    const { password, confirmation_token } = req.body;

    const response = await databaseServiceInterceptor({
      query_name: "updateUserPassword",
      confirmation_token,
      password: passwordEncrypt(password),
    });

    await databaseServiceInterceptor({
      query_name: "updateUserConfirmationToken",
      confirmation_token: "",
      id: _.get(response, "id"),
    });

    const result = {
      status: true,
      message: "password updated successfully",
    };

    res.create(result).success().send();
  })
);

export default router;
