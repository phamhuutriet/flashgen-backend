import { KeyObject } from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import { asyncHandler } from "./checkAuth";
import { NextFunction, Request } from "express";
import {
  AuthFailureErrorResponse,
  NotFoundErrorResponse,
} from "../core/error.response";
import { findByUserId } from "../services/token.service";
import { Types } from "mongoose";

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

export const createTokenPair = (
  payload: Object,
  publicKey: KeyObject,
  privateKey: string
) => {
  const accessToken = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "2 days",
  });
  const refreshToken = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "7 days",
  });

  // verify tokens
  jwt.verify(accessToken, publicKey, (err: any, decode: any) => {
    if (err) {
      console.error("verification error", err);
    } else {
      console.log(`decode verify: ${decode}`);
    }
  });

  return { accessToken, refreshToken };
};

export const authentication = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Check user Id
    const userId = req.headers[HEADER.CLIENT_ID] as string;
    if (!userId) throw new AuthFailureErrorResponse("Invalid userId");

    // Check tokenStore
    const tokenStore = await findByUserId(new Types.ObjectId(userId));
    if (!tokenStore) throw new NotFoundErrorResponse("Token store not found");

    const accessToken = req.headers[HEADER.AUTHORIZATION] as string;
    if (!accessToken)
      throw new AuthFailureErrorResponse("Invalid access token");

    try {
      const decodeUser = jwt.verify(
        accessToken,
        tokenStore.publicKey
      ) as JwtPayload;
      if (userId != decodeUser.userId)
        throw new AuthFailureErrorResponse("Invalid userId");
      req.tokenStore = tokenStore;
      console.log("Authentication successfully");
      return next();
    } catch (error) {
      throw error;
    }
  }
);
