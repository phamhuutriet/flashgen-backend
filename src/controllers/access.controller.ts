import { RequestHandler } from "express";
import {
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
