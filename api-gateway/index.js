import express from "express";
import config from "./src/config";
import tokenValidator from "./src/utils/tokenValidator";
import routes from "./src/routes/routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("*", (req, res, next) => {
  tokenValidator(req, res, next);
});

app.get("/", (req, res) => {
  res.send(`server working fine`); // just to check gateway is working
});

app.use("/", routes);

app.listen(config.port, (err) => {
  if (err) {
    console.log("something went wrong", err);
    return;
  }
  console.log("Server started on port number", config.port);
});
