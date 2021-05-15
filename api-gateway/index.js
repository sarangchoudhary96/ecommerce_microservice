import express from "express";
import config from "./src/config";
import tokenValidator from "./src/tokenValidator";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("*", (req, res, next) => {
  tokenValidator(req, res, next);
});

app.get("/", (req, res) => {
  res.send(`server working fine`);
});

app.listen(config.port, (err) => {
  if (err) {
    console.log("something went wrong", err);
    return;
  }
  console.log("Server started on port number", config.port);
});
