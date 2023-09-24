import { createTransport } from "nodemailer";
import { getRedisClient } from "../dbs/init.redis";
import userModel from "../models/user.model";
import { createPublicKey, generateKeyPairSync, randomBytes } from "crypto";
import { hash, compare } from "bcrypt";
import { formatResult } from "./utils";
import { createTokenPair } from "../auth/authUtils";
import {
  AuthFailureErrorResponse,
  BadRequestErrorResponse,
  ConflictErrorResponse,
} from "../core/error.response";
import { findByEmail } from "./shop.service";
import { createKeyToken, removeByUserId } from "./token.service";

const RedisCacheTTL = 120;

interface PreSignUpProps {
  username: string;
  email: string;
  password: string;
}

export const preSignUpService = async ({
  username,
  email,
  password,
}: PreSignUpProps) => {
  // step 1: check if username existed
  const holderUser = await userModel.findOne({ username });
  if (holderUser) {
    throw new ConflictErrorResponse("Error: username is already existed");
  }

  // step 2: store sign up data in cache
  const redisClient = await getRedisClient();
  const signUpToken = randomBytes(32).toString("hex");
  const serializedData = JSON.stringify({ username, email, password });
  redisClient.set(signUpToken, serializedData, { EX: RedisCacheTTL });

  // step 3: send verification email
  await sendVerificationEmail(signUpToken, email);

  return {
    code: "xxx",
    message: "Pre sign up successfully, please verify your email",
  };
};

const sendVerificationEmail = async (signUpToken: string, email: string) => {
  // Create a transporter object using SMTP transport
  const transporter = createTransport({
    service: "Gmail", // Use your email service provider here
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  console.log(process.env.HOST);
  // Define email data
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "BACKEND SERVICE EMAIL VERIFICATION",
    text: `Email verification link: http://${process.env.HOST}:${process.env.PORT}/v1/api/user/signup/verify-email?signUpToken=${signUpToken}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export const postSignUpService = async ({
  signUpToken,
}: {
  signUpToken: string;
}) => {
  // step1: Retrieve sign up info
  const redisClient = await getRedisClient();
  const serializedData = await redisClient.get(signUpToken);

  if (!serializedData) {
    throw new ConflictErrorResponse("Error: verification link expired");
  }

  const { username, email, password } = JSON.parse(serializedData);
  const passwordHash = await hash(password, 10);
  const newUser = await userModel.create({
    username,
    email,
    password: passwordHash,
  });

  if (!newUser) {
    throw new ConflictErrorResponse("Error: new user is already existed");
  }

  // step 2: generate access token and refresh token
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 4096,
    // This helps decoded back to string form to store in key token schema
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });
  const publicKeyObject = createPublicKey(publicKey);
  const tokens = createTokenPair(
    { userId: newUser._id, username: newUser.username },
    publicKeyObject,
    privateKey
  );
  await createKeyToken(newUser._id, publicKey, tokens.refreshToken);

  return {
    code: "xxx",
    metadata: {
      user: formatResult(["_id", "username", "email"], newUser),
      tokens,
    },
  };
};

type LoginProps = {
  email: string;
  password: string;
  refreshToken: string | null;
};

/*
    1. Check email existed
    2. Compare password
    3. Create AT and RT and save
    4. generate tokens
    5. get data return login
  */

export const loginService = async ({
  email,
  password,
  refreshToken = null,
}: LoginProps) => {
  // Check if email existed
  const foundUser = await findByEmail(email);
  if (!foundUser)
    throw new BadRequestErrorResponse("Error: User not registered");

  // Compare password
  const match = compare(foundUser.password, password);
  if (!match) {
    throw new AuthFailureErrorResponse("Error: password is not match");
  }

  // Generate public key and private key
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 4096,
    // This helps decoded back to string form to store in key token schema
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });

  const tokens = createTokenPair(
    { userId: foundUser._id, username: foundUser.username },
    createPublicKey(publicKey),
    privateKey
  );

  await createKeyToken(foundUser._id, publicKey, tokens.refreshToken);

  return {
    code: "xxx",
    metadata: {
      user: formatResult(["_id", "username", "email"], foundUser),
      tokens,
    },
  };
};

export const logoutService = async (tokenStore: any) => {
  const delToken = await removeByUserId(tokenStore.userId);
  return delToken;
};
