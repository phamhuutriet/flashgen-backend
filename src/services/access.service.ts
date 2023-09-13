import { createTransport } from "nodemailer";
import { getRedisClient } from "../dbs/init.redis";
import userModel from "../models/user.model";
import crypto from "crypto";

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
    return {
      code: "xxx",
      message: "Username is already existed",
    };
  }

  // step 2: store sign up data in cache
  const redisClient = await getRedisClient();
  const signUpToken = crypto.randomBytes(32).toString("hex");
  const serializedData = JSON.stringify({ username, email, password });
  redisClient.set(signUpToken, serializedData, { EX: 30 });

  // step 3: send verification email
  await sendVerificationEmail(signUpToken, email);

  return {
    code: "xxx",
    message: "Pre sign up successfully, please verify your email",
  };
};

const sendVerificationEmail = async (signUpToken: string, email: string) => {
  // Create a transporter object using SMTP transport
  console.log(process.env.EMAIL, process.env.EMAIL_PASSWORD);
  const transporter = createTransport({
    service: "Gmail", // Use your email service provider here
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Define email data
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "BACKEND SERVICE EMAIL VERIFICATION",
    text: `Email verification link: http://localhost:3052/v1/api/shop/signup/confirm-signup-email?signUpToken=${signUpToken}`,
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
