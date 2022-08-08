import JWT, { JwtPayload } from "jsonwebtoken";
import logger from "./logger";

interface payloadType extends JwtPayload {
  userId?: string;
  role?: string;
}

export const signToken = (
  userId: string,
  role: string,
  secret: string,
  expiry: string,
  payload: payloadType = {}
) => {
  const options = {
    expiresIn: expiry,
    issuer: "pizza-app",
    audience: userId,
  };
  payload.role = role;

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
