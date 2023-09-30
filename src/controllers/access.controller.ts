import { NextFunction, Request, RequestHandler, Response } from "express";
import {
  handleRefreshTokenService,
  loginService,
  logoutService,
  postSignUpService,
  preSignUpService,
} from "../services/access.service";
import { CreatedResponse, OKResponse } from "../core/success.response";

export const preSignUp: RequestHandler = async (req, res, next) => {
  return new OKResponse({
    message: "Verification email sent !",
    metadata: await preSignUpService(req.body),
  }).send(res);
};

export const postSignUp: RequestHandler = async (req, res, next) => {
  const signUpToken = req.query.signUpToken as string;
  return new CreatedResponse({
    message: "Registered successfully !",
    metadata: await postSignUpService({ signUpToken }),
  }).send(res);
};

export const login: RequestHandler = async (req, res, next) => {
  return new CreatedResponse({
    message: "User returned",
    metadata: await loginService(req.body),
  }).send(res);
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return new OKResponse({
    message: "Log out successfully !",
    metadata: await logoutService(req.tokenStore),
  }).send(res);
};

export const handleRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return new OKResponse({
    message: "Get tokens successfully",
    metadata: await handleRefreshTokenService(req.body.refreshToken),
  }).send(res);
};
