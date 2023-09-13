import { RequestHandler } from "express";
import { preSignUpService } from "../services/access.service";

export const preSignUp: RequestHandler = async (req, res, next) => {
  try {
    return res.status(200).json(await preSignUpService(req.body));
  } catch (error) {
    next(error);
  }
};
