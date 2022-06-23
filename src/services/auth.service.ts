import { signToken } from "../utils/jwt";
import User from "../models/user.model";
import { userDocument } from "../types/user.type";

interface verifyEmailPassReturnType {
  valid: boolean;
  status: number;
  context?: string;
  message?: string;
  user?: userDocument;
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
        status: 404,
        context: "email",
        message: "email not found",
      };

    // //email verified?
    // if (!user.verified)
    //   return {
    //     valid: false,
    //     status: 401,
    //     context: "email",
    //     message: "email not verified",
  
    //   };

    //password correct?
    const isMatched = await user.comparePassword(password);
    if (!isMatched)
      return {
        valid: false,
        status: 401,
        context: "password",
        message: "incorrect password",
      };

    //all good!
    return {
      valid: true,
      status: 200,
      user,
    };

    // skipcq
  } catch (err: any) {
    throw new Error(err);
  }
};

//provide secret only for tests
export const generateAuthTokens = (userId: string) => {
  try {
    //sign tokens
    //FIXME "or" secret is only for testing, find a better way to pass a secret
    const access_secret = process.env.ACCESS_SECRET || "secret";
    const refresh_secret = process.env.REFRESH_SECRET || "secret";
    const access_expiry = process.env.ACCESS_TTL || "1m";
    const refresh_expiry = process.env.REFRESH_TTL || "1m";

    const accessToken = signToken(userId, access_secret, access_expiry);
    const refreshToken = signToken(userId, refresh_secret, refresh_expiry);

    return { accessToken, refreshToken };

    // skipcq
  } catch (err: any) {
    throw new Error(err);
  }
};
