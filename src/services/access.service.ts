import { createTransport } from "nodemailer";
import { getRedisClient } from "../dbs/init.redis";
import userModel from "../models/user.model";
import { createPublicKey, generateKeyPairSync, randomBytes } from "crypto";
import { hash } from "bcrypt";
import { createPublicKeyString, formatResult } from "./utils";
import { createTokenPair } from "../auth/authUtils";
import { ConflictErrorResponse } from "../core/error.response";

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

  const publicKeyString = (await createPublicKeyString(
    newUser._id,
    publicKey
  )) as string;
  const publicKeyObject = createPublicKey(publicKeyString);
  const tokens = createTokenPair(
    { userId: newUser._id, username: newUser.username },
    publicKeyObject,
    privateKey
  );

  return {
    code: "xxx",
    metadata: {
      user: formatResult(["_id", "username", "email"], newUser),
      tokens,
    },
  };
};
