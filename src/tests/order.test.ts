// import request from "supertest";
// import app from "../utils/app";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
// import { createUser, findUser } from "../services/user.service";
// import { generateRandomUser } from "./testUtils/randomGenerators";
// import { generateAuthTokens } from "../services/auth.service";
import Order from "../models/order.model";

describe("user", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    await Order.deleteMany({});
  });

  beforeEach(async () => {
    await Order.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("sanity check", () => {
    it("has a moddule", () => {
      expect(Order).toBeDefined();
    });
  });

  //TODO complete tests
});
