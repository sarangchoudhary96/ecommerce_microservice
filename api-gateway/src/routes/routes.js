import express from "express";
import registry from "./registry.json";
import _ from "lodash";
import constants from "../../constants"; //remove

const router = express.Router();

router.all("/:apiName/:path", async (req, res) => {
  const service = registry.services[req.params.apiName];
  if (service) {
    const endPoint = constants[_.get(service, "endPoint", "")]; //remove
    console.log(endPoint + req.params.path); //remove
    const params = { path: req.params.path };
    const response = _.get(service, "interceptor")(req, params);
    res.send(response);
  } else {
    res.send("API does not exist");
  }
});

export default router;
