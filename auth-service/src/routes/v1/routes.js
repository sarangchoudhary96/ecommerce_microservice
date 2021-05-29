import express from "express";
import { databaseServiceInterceptor } from "../../utils/interceptor";
import asyncHandler from "../../utils/errorWrapper";

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

export default router;
