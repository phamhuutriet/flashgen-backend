import express from "express";
import { preSignUp } from "../../controllers/access.controller";

const accessRouter = express.Router();

accessRouter.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Access GET method executed !",
  });
});

accessRouter.post("/user/signup", preSignUp);

export default accessRouter;
