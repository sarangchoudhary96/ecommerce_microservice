import express from "express";
import v1routes from "./src/routes/v1/routes";
import v2routes from "./src/routes/v2/routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1", v1routes);
app.use("/v2", v2routes);

app.listen(config.port, (err) => {
  if (err) {
    console.log("something went wrong", err);
    return;
  }
  console.log("Server started on port number", config.port);
});
