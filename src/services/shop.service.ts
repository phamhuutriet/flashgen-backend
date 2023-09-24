import userModel from "../models/user.model";

export const findByEmail = async (
  email: string,
  select: Record<string, number | boolean | object> = {
    email: 1,
    username: 1,
    password: 1,
  }
) => {
  return await userModel.findOne({ email }).select(select).lean();
};
