import { RequestHandler } from "express";
import {
  postSignUpService,
  preSignUpService,
} from "../services/access.service";

export const preSignUp: RequestHandler = async (req, res, next) => {
  try {
    return res.status(200).json(await preSignUpService(req.body));
  } catch (error) {
    next(error);
  }
};

export const postSignUp: RequestHandler = async (req, res, next) => {
  try {
    const signUpToken = req.query.signUpToken as string;
    return res.status(201).json(await postSignUpService({ signUpToken }));
  } catch (error) {
    next(error);
  }
};
