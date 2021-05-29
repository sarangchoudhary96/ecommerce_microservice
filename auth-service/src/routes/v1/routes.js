import express from "express";
import { databaseServiceInterceptor } from "../../utils/interceptor";

const router = express.Router();

router.get("/login", (req, res) => {
  res.create({ auth: "yes" }).success().send();
});

router.get("/register", (req, res) => {});

export default router;
