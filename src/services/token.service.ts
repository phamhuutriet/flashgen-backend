import { Types } from "mongoose";
import tokenModel from "../models/token.model";

export const createKeyToken = async (
  userId: Types.ObjectId,
  publicKey: String,
  refreshToken: String
) => {
  const filter = { userId };
  const update = { publicKey, refreshToken, usedRefreshTokens: [] };
  const option = { upsert: true, new: true };

  const tokens = await tokenModel.findOneAndUpdate(filter, update, option);
  return tokens ? publicKey : null;
};

export const findByUserId = async (userId: Types.ObjectId) => {
  return await tokenModel.findOne({ userId }).lean();
};

export const removeByUserId = async (userId: Types.ObjectId) => {
  return await tokenModel.findOneAndRemove({ userId });
};

export const findByUsedRefreshToken = async (refreshToken: string) => {
  return await tokenModel.findOne({ usedRefreshTokens: refreshToken });
};

export const findByRefreshToken = async (refreshToken: string) => {
  return await tokenModel.findOne({ refreshToken });
};
