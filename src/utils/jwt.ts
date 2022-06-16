import JWT from "jsonwebtoken";

export const signToken = (
  userId: string,
  type: "ACCESS" | "REFRESH" | "OTHER",
  payload: object = {}
) => {
  return new Promise((resolve, reject) => {
    let secret = "";
    let expiry = "";

    if (type === "ACCESS") {
      secret = process.env["ACCESS_SECRET"]!;
      expiry = process.env["ACCESS_TTL"]!;
    } else if (type === "REFRESH") {
      secret = process.env["REFRESH_SECRET"]!;
      expiry = process.env["REFRESH_TTL"]!;
    } else {
      secret = process.env["TOKEN_SECRET"]!;
      expiry = process.env["TOKEN_EXPIRY"]!;
    }
    const options = {
      expiresIn: expiry,
      issuer: "pizza-app",
      audience: userId,
    };
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        return reject(err.message);
      }
      resolve(token);
    });
  });
};

export const verifyToken = (
  token: string,
  type: "ACCESS" | "REFRESH" | "OTHER"
) => {
  return new Promise((resolve, reject) => {
    let secret = "";
    let expiry = "";

    if (type === "ACCESS") {
      secret = process.env["ACCESS_SECRET"]!;
      expiry = process.env["ACCESS_TTL"]!;
    } else if (type === "REFRESH") {
      secret = process.env["REFRESH_SECRET"]!;
      expiry = process.env["REFRESH_TTL"]!;
    } else {
      secret = process.env["TOKEN_SECRET"]!;
      expiry = process.env["TOKEN_EXPIRY"]!;
    }

    JWT.verify(token, secret, (err, payload) => {
      if (err) return reject(err);
      return resolve(payload);
    });
  });
};
