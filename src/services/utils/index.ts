import mongoose from "mongoose";
import tokenModel from "../../models/token.model";
import { pick } from "lodash";

export const createPublicKeyString = async (
  userId: mongoose.Types.ObjectId,
  publicKey: string
) => {
  try {
    const publicKeyString = publicKey.toString();
    const token = await tokenModel.create({
      userId,
      publicKey: publicKeyString,
    });
    return token ? publicKeyString : "";
  } catch (error) {
    console.error("Error creating public key string", error);
  }
};

export const formatResult = (fields: string[], data: Object) => {
  return pick(data, fields);
};
