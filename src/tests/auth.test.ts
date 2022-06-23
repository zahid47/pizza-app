import request from "supertest";
import app from "../utils/app";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../models/user.model";
import { createUser } from "../services/user.service";
import generateRandomUser from "./testUtils/generateRandomUser";

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

  describe("POST /api/v1/auth/login", () => {
    describe("given email and password is not provided", () => {
      it("should return a 400", async () => {
        const { statusCode } = await request(app)
          .post(`/api/v1/auth/login`)
          .send(); //sending nothing lol

        expect(statusCode).toBe(400);
      });
    });
  });

  describe("POST /api/v1/auth/login", () => {
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
  });

  describe("POST /api/v1/auth/login", () => {
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
  });

  describe("POST /api/v1/auth/login", () => {
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
