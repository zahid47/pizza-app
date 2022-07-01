import JWT from "jsonwebtoken";
import logger from "./logger";

export const signToken = (
  userId: string,
  secret: string,
  expiry: string,
  payload: object = {}
) => {
  const options = {
    expiresIn: expiry,
    issuer: "pizza-app",
    audience: userId,
  };

  return JWT.sign(payload, secret, options);
};

export const verifyToken = (token: string, secret: string) => {
  try {
    const payload = JWT.verify(token, secret);

    return {
      valid: true,
      expired: false,
      payload,
    };
  } catch (err: any) {
    logger.error(err);
    return {
      valid: false,
      expired: err.message === "jwt expired",
      payload: null,
    };
  }
};
