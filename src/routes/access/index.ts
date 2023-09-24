import express from "express";
import {
  login,
  logout,
  postSignUp,
  preSignUp,
} from "../../controllers/access.controller";
import { asyncHandler } from "../../auth/checkAuth";
import { authentication } from "../../auth/authUtils";

const accessRouter = express.Router();

accessRouter.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Access GET method executed !",
  });
});

accessRouter.post("/user/signup", asyncHandler(preSignUp));
accessRouter.get("/user/signup/verify-email", asyncHandler(postSignUp));
accessRouter.get("/user/login", asyncHandler(login));

// AUTHENTICATION
accessRouter.use(authentication);

// APIs
accessRouter.get("/user/logout", asyncHandler(logout));

export default accessRouter;
