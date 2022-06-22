import request from "supertest";
import app from "../utils/app";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../models/user.model";
import { createUser } from "../services/user.service";
import generateRandomUser from "./testUtils/generateRandomUser";

describe("user", () => {
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

  describe("POST /api/v1/user/:id", () => {
    describe("given name, email, password is not provided", () => {
      it("should return a 400", async () => {
        const { statusCode } = await request(app).post(`/api/v1/user`).send(); //sending nothing
        expect(statusCode).toBe(400);
      });
    });
  });

  describe("POST /api/v1/user/:id", () => {
    describe("given name, email, password is provided", () => {
      it("should return a 201 and create an user", async () => {
        const user = generateRandomUser();
        const { statusCode, body } = await request(app)
          .post(`/api/v1/user`)
          .send(user);
        expect(statusCode).toBe(201);
        expect(body.name).toEqual(user.name);
      });
    });
  });

  describe("POST /api/v1/user/:id", () => {
    describe("given extra fields are provided", () => {
      it("should return a 400", async () => {
        let user: any = generateRandomUser();
        user = { ...user, verified: true };

        const { statusCode } = await request(app)
          .post(`/api/v1/user`)
          .send(user);
        expect(statusCode).toBe(400);
      });
    });
  });

  describe("GET /api/v1/user", () => {
    describe("given no user exist", () => {
      it("should return a 200 and an empty array", async () => {
        const { statusCode, body } = await request(app).get(`/api/v1/user`);
        expect(statusCode).toBe(200);
        expect(body.length).toEqual(0);
      });
    });
  });

  describe("GET /api/v1/user", () => {
    describe("given some users exist", () => {
      it("should return a 200 and less than or equal to 'limit' number of users", async () => {
        await createUser(generateRandomUser());
        await createUser(generateRandomUser());
        await createUser(generateRandomUser());

        const limit = 2;
        const { statusCode, body } = await request(app).get(
          `/api/v1/user?limit=${limit}`
        );
        expect(statusCode).toBe(200);
        expect(body.length).toBeLessThanOrEqual(limit);
      });
    });
  });

  describe("GET /api/v1/user/:id", () => {
    describe("given a user with a specific id don't exist", () => {
      it("should return a 404", async () => {
        const fakeId = "62aca583712384e283ebae8c";
        const { statusCode } = await request(app).get(`/api/v1/user/${fakeId}`);
        expect(statusCode).toBe(404);
      });
    });
  });

  describe("GET /api/v1/user/:id", () => {
    describe("given a user with a specific id exist", () => {
      it("should return a 200 and the user", async () => {
        const user = await createUser(generateRandomUser());
        const { statusCode, body } = await request(app).get(
          `/api/v1/user/${user._id}`
        );
        expect(statusCode).toBe(200);
        expect(body.name).toEqual(user.name);
      });
    });
  });
});
