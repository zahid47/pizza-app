import JWT from "jsonwebtoken";
import logger from "./logger";

//here we are using a generic "secret" as secreyOrKey for running tests in github ci
//TODO find a better way to do this

export const signToken = (
  userId: string,
  secret: string,
  expiry: string,
  payload: object = {}
) => {
  const options = {
    expiresIn: expiry || "1m", //FIXME
    issuer: "pizza-app",
    audience: userId,
  };

  return JWT.sign(payload, secret || "secret", options); //FIXME
};

export const verifyToken = (token: string, secret: string) => {
  try {
    const payload = JWT.verify(token, secret || "secret"); //FIXME

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
