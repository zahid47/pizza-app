import request from "supertest";
import app from "../utils/app";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../models/user.model";
import { createUser } from "../services/user.service";
import { generateRandomUser } from "./testUtils/randomGenerators";
import { generateAuthTokens } from "../services/auth.service";

describe("auth", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    await User.deleteMany({});
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("sanity check", () => {
    it("has a moddule", () => {
      expect(User).toBeDefined();
    });
  });

  describe("login", () => {
    describe("POST /api/v1/auth/login", () => {
      describe("given email and password is not provided", () => {
        it("should return a 400", async () => {
          const { statusCode } = await request(app)
            .post(`/api/v1/auth/login`)
            .send(); //sending nothing lol

          expect(statusCode).toBe(400);
        });
      });

      describe("given incorrect email is provided", () => {
        it("should return a 404", async () => {
          const userInfo = generateRandomUser();
          await createUser(userInfo);
          const badEmail = userInfo.email + "x";

          const { statusCode } = await request(app)
            .post(`/api/v1/auth/login`)
            .send({ email: badEmail, password: userInfo.password }); //sending a wrong email

          expect(statusCode).toBe(404);
        });
      });

      describe("given incorrect password is provided", () => {
        it("should return a 401", async () => {
          const userInfo = generateRandomUser();
          await createUser(userInfo);
          const badPass = userInfo.password + "x";

          const { statusCode } = await request(app)
            .post(`/api/v1/auth/login`)
            .send({ email: userInfo.email, password: badPass }); //sending a wrong password

          expect(statusCode).toBe(401);
        });
      });

      describe("given correct email and password is provided", () => {
        it("should return a 200 and send an accessToken", async () => {
          const userInfo = generateRandomUser();
          await createUser(userInfo);

          const { statusCode, body } = await request(app)
            .post(`/api/v1/auth/login`)
            .send({ email: userInfo.email, password: userInfo.password });

          expect(statusCode).toBe(200);
          expect(body.accessToken).toBeDefined();
        });
      });
    });
  });

  describe("me", () => {
    describe("GET /api/v1/auth/me", () => {
      describe("given no user is logged in", () => {
        it("should return a 401", async () => {
          const { statusCode } = await request(app).get(`/api/v1/auth/me`);

          expect(statusCode).toBe(401);
        });
      });

      describe("given a user is logged in", () => {
        it("should return a 200 and the user", async () => {
          const user = await createUser(generateRandomUser());
          const { accessToken } = generateAuthTokens(user.id, user.role);

          const { statusCode, body } = await request(app)
            .get(`/api/v1/auth/me`)
            .set("Authorization", `Bearer ${accessToken}`); //sending an access token with the request so that the user is authorized

          expect(statusCode).toBe(200);
          expect(body._id).toEqual(user.id);
        });
      });
    });
  });

  describe("refresh", () => {
    describe("GET /api/v1/auth/refresh", () => {
      describe("given no refresh token is provided", () => {
        it("should return a 400", async () => {
          const { statusCode } = await request(app).get(`/api/v1/auth/refresh`);

          expect(statusCode).toBe(400);
        });
      });

      describe("given refresh token is invalid or expired", () => {
        it("should return a 401", async () => {
          const user = await createUser(generateRandomUser());
          let { refreshToken } = generateAuthTokens(user.id, user.role);

          refreshToken = refreshToken.split(".")[0]; //invalidating the refresh token

          const { statusCode } = await request(app).get(
            `/api/v1/auth/refresh?refreshToken=${refreshToken}`
          );

          expect(statusCode).toBe(401);
        });
      });

      describe("given refresh token is valid", () => {
        it("should return a 200 and a new accessToken", async () => {
          const user = await createUser(generateRandomUser());
          let { refreshToken } = generateAuthTokens(user.id, user.role);

          const { statusCode, body } = await request(app).get(
            `/api/v1/auth/refresh?refreshToken=${refreshToken}`
          );

          expect(statusCode).toBe(200);
          expect(body.accessToken).toBeDefined();
        });
      });
    });
  });
});
