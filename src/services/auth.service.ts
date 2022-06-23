import { signToken } from "../utils/jwt";
import User from "../models/user.model";
import { userDocument } from "../types/user.type";

interface verifyEmailPassReturnType {
  valid: boolean;
  statusCode: number;
  errorField: string | null;
  errorMessage: string | null;
  user: userDocument | null;
}

export const verifyEmailPass = async (
  email: string,
  password: string
): Promise<verifyEmailPassReturnType> => {
  try {
    //email exists?
    const user = await User.findOne({ email });
    if (!user)
      return {
        valid: false,
        statusCode: 404,
        errorField: "email",
        errorMessage: "email not found",
        user: null,
      };

    //email verified?
    // if (!user.verified)
    //   return {
    //     valid: false,
    //     statusCode: 401,
    //     errorField: "email",
    //     errorMessage: "email not verified",
    //     user: null,
    //   };

    //password correct?
    const isMatched = await user.comparePassword(password);
    if (!isMatched)
      return {
        valid: false,
        statusCode: 401,
        errorField: "password",
        errorMessage: "incorrect password",
        user: null,
      };

    //all good!
    return {
      valid: true,
      statusCode: 200,
      errorField: null,
      errorMessage: null,
      user,
    };

    // skipcq
  } catch (err: any) {
    throw new Error(err);
  }
};

export const generateAuthTokens = (userId: string) => {
  try {
    //sign tokens
    const access_secret = process.env.ACCESS_SECRET;
    const refresh_secret = process.env.REFRESH_SECRET;
    const access_expiry = process.env.ACCESS_TTL;
    const refresh_expiry = process.env.REFRESH_TTL;

    const accessToken = signToken(userId, access_secret, access_expiry);
    const refreshToken = signToken(userId, refresh_secret, refresh_expiry);

    return { accessToken, refreshToken };

    // skipcq
  } catch (err: any) {
    throw new Error(err);
  }
};
