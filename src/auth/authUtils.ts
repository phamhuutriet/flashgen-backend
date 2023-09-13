import { KeyObject } from "crypto";
import jwt from "jsonwebtoken";

export const createTokenPair = (
  payload: Object,
  publicKey: KeyObject,
  privateKey: string
) => {
  try {
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
  } catch (error) {
    console.error("Error creating token pair: ", error);
  }
};
