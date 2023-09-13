import express from "express";
import { postSignUp, preSignUp } from "../../controllers/access.controller";

const accessRouter = express.Router();

accessRouter.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Access GET method executed !",
  });
});

accessRouter.post("/user/signup", preSignUp);
accessRouter.get("/user/signup/verify-email", postSignUp);

export default accessRouter;
