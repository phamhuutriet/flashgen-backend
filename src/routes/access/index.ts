import express from "express";
import { postSignUp, preSignUp } from "../../controllers/access.controller";
import { asyncHandler } from "../../auth/checkAuth";

const accessRouter = express.Router();

accessRouter.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Access GET method executed !",
  });
});

accessRouter.post("/user/signup", asyncHandler(preSignUp));
accessRouter.get("/user/signup/verify-email", asyncHandler(postSignUp));

export default accessRouter;
