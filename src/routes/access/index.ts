import express from "express";
import {
  handleRefreshToken,
  login,
  logout,
  postSignUp,
  preSignUp,
} from "../../controllers/access.controller";
import { asyncHandler } from "../../auth/checkAuth";
import { authentication } from "../../auth/authUtils";
import businessLogicRouter from "../businessLogic";

const accessRouter = express.Router();

accessRouter.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Access GET method executed !",
  });
});

accessRouter.post("/user/signup", asyncHandler(preSignUp));
accessRouter.get("/user/signup/verify-email", asyncHandler(postSignUp));
accessRouter.get("/user/login", asyncHandler(login));

// AUTHENTICATION - have to pass this in order to access services
accessRouter.use(authentication);

// ACCESS APIs
accessRouter.get("/user/logout", asyncHandler(logout));
accessRouter.get("/user/handleRefreshToken", asyncHandler(handleRefreshToken));

// BUSINESS LOGIC APIs
accessRouter.use(businessLogicRouter);

export default accessRouter;
