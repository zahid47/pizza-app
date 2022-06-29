import request from "supertest";
import app from "../utils/app";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../models/user.model";
import { createUser, findUser } from "../services/user.service";
import { generateRandomUser } from "./testUtils/randomGenerators";
import { generateAuthTokens } from "../services/auth.service";

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

  describe("create user", () => {
    describe("POST /api/v1/user/", () => {
      describe("given name, email, password is not provided", () => {
        it("should return a 400", async () => {
          const { statusCode } = await request(app).post(`/api/v1/user`).send(); //sending nothing
          expect(statusCode).toBe(400);
        });
      });
    });
  });

  describe("create user", () => {
    describe("POST /api/v1/user/", () => {
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
  });

  describe("create user", () => {
    describe("POST /api/v1/user/", () => {
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
  });

  describe("get users", () => {
    describe("GET /api/v1/user", () => {
      describe("given no user exist", () => {
        it("should return a 200 and an empty array", async () => {
          const { statusCode, body } = await request(app).get(`/api/v1/user`);
          expect(statusCode).toBe(200);
          expect(body.length).toEqual(0);
        });
      });
    });
  });

  describe("get users", () => {
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
  });

  describe("get user", () => {
    describe("GET /api/v1/user/:id", () => {
      describe("given a user with a specific id don't exist", () => {
        it("should return a 404", async () => {
          const fakeId = "62aca583712384e283ebae8c";
          const { statusCode } = await request(app).get(
            `/api/v1/user/${fakeId}`
          );
          expect(statusCode).toBe(404);
        });
      });
    });
  });

  describe("get user", () => {
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

  describe("update user", () => {
    describe("PUT /api/v1/user/:id", () => {
      describe("given the user is not authorized", () => {
        it("should return a 401 and not update the user", async () => {
          const user = await createUser(generateRandomUser());
          const updated = { name: "updated" };

          const { statusCode, body } = await request(app)
            .put(`/api/v1/user/${user._id}`)
            .send(updated);

          expect(statusCode).toBe(401);
          expect(body.name).not.toEqual(updated.name);
        });
      });
    });
  });

  describe("update user", () => {
    describe("PUT /api/v1/user/:id", () => {
      describe("given the user is trying to update someone else's profile", () => {
        it("should return a 403", async () => {
          const user1 = await createUser(generateRandomUser());
          const user2 = await createUser(generateRandomUser());
          const update = { name: "updated" };
          const { accessToken } = generateAuthTokens(user2.id); //logging in as user2

          const { statusCode, body } = await request(app)
            .put(`/api/v1/user/${user1._id}`) //but trying to update user1's profile
            .set("Authorization", `Bearer ${accessToken}`)
            .send(update);

          expect(statusCode).toBe(403);
          expect(body.name).not.toEqual(update.name);
        });
      });
    });
  });

  describe("update user", () => {
    describe("PUT /api/v1/user/:id", () => {
      describe("given the user is authorized as the correct user", () => {
        it("should return a 200 and update the user", async () => {
          const userInfo = generateRandomUser();
          const user = await createUser(userInfo);
          const update = { name: "updated" };
          const { accessToken } = generateAuthTokens(user.id);

          const { statusCode, body } = await request(app)
            .put(`/api/v1/user/${user._id}`)
            .set("Authorization", `Bearer ${accessToken}`) //sending an access token with the request so that the user is authorized
            .send(update);

          expect(statusCode).toBe(200);
          expect(body.name).toEqual(update.name);
        });
      });
    });
  });

  describe("delete user", () => {
    describe("DELETE /api/v1/user/:id", () => {
      describe("given the user is not authorized", () => {
        it("should return a 401 and not delete the user", async () => {
          const user = await createUser(generateRandomUser());

          const { statusCode } = await request(app).delete(
            `/api/v1/user/${user._id}`
          );
          const notDeletedUser = await findUser(user.id);

          expect(statusCode).toBe(401);
          expect(notDeletedUser).not.toBe(null);
        });
      });
    });
  });

  describe("delete user", () => {
    describe("DELETE /api/v1/user/:id", () => {
      describe("given the user is trying to delete someone else's profile", () => {
        it("should return a 403", async () => {
          const user1 = await createUser(generateRandomUser());
          const user2 = await createUser(generateRandomUser());
          const { accessToken } = generateAuthTokens(user2.id); //logging in as user2

          const { statusCode } = await request(app)
            .delete(`/api/v1/user/${user1._id}`) //but trying to delete user1's profile
            .set("Authorization", `Bearer ${accessToken}`);

          const notDeletedUser = await findUser(user1.id);

          expect(statusCode).toBe(403);
          expect(notDeletedUser).not.toBe(null);
        });
      });
    });
  });

  describe("delete user", () => {
    describe("DELETE /api/v1/user/:id", () => {
      describe("given the user is authorized as the correct user", () => {
        it("should return a 200 and delete the user", async () => {
          const user = await createUser(generateRandomUser());
          const { accessToken } = generateAuthTokens(user.id);

          const { statusCode } = await request(app)
            .delete(`/api/v1/user/${user._id}`)
            .set("Authorization", `Bearer ${accessToken}`); //sending an access token with the request so that the user is authorized

          const deletedUser = await findUser(user.id);

          expect(statusCode).toBe(200);
          expect(deletedUser).toBe(null);
        });
      });
    });
  });
});
