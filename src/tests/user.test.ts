import request from "supertest";
import app from "../utils/app";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import User from "../models/user.model";
import { createUser, findUserById } from "../services/user.service";
import { generateRandomUser } from "./testUtils/randomGenerators";
import { generateAuthTokens } from "../services/auth.service";
import { reverseString } from "./testUtils/reverseString";

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
        it("should return a 400 and not create an user", async () => {
          const { statusCode, body } = await request(app)
            .post(`/api/v1/user`)
            .send(); //sending nothing

          expect(statusCode).toBe(400);
          expect(body).not.toHaveProperty("name");
          expect(body.context).toEqual("validate");
        });
      });
    });

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

    describe("POST /api/v1/user/", () => {
      describe("given extra unaccepted fields are provided", () => {
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

    describe("POST /api/v1/user/", () => {
      describe("given duplicate email provided", () => {
        it("should return a 409", async () => {
          const user1 = await createUser(generateRandomUser());
          let user2 = generateRandomUser();
          user2 = { ...user2, email: user1.email };

          const { statusCode } = await request(app)
            .post(`/api/v1/user`)
            .send(user2);

          expect(statusCode).toBe(409);
        });
      });
    });
  });

  describe("get users", () => {
    describe("GET /api/v1/user", () => {
      describe("given user is not authenticated", () => {
        it("should return a 401", async () => {
          await createUser(generateRandomUser());
          await createUser(generateRandomUser());
          await createUser(generateRandomUser());

          const { statusCode } = await request(app).get(`/api/v1/user`);

          expect(statusCode).toBe(401);
        });
      });
    });

    describe("GET /api/v1/user", () => {
      describe("given the user is not an admin", () => {
        it("should return a 403", async () => {
          const normalUser = await createUser(generateRandomUser());
          const { accessToken } = generateAuthTokens(normalUser.id);

          await createUser(generateRandomUser());
          await createUser(generateRandomUser());
          await createUser(generateRandomUser());

          const { statusCode } = await request(app)
            .get(`/api/v1/user`)
            .set("Authorization", `Bearer ${accessToken}`);

          expect(statusCode).toBe(403);
        });
      });
    });

    describe("GET /api/v1/user", () => {
      describe("given an admin us authenticated and some users exist", () => {
        it("should return a 200 and less than or equal to 'limit' number of users", async () => {
          const adminUser = await createUser(generateRandomUser("admin"));
          const { accessToken } = generateAuthTokens(adminUser.id);

          await createUser(generateRandomUser());
          await createUser(generateRandomUser());
          await createUser(generateRandomUser());

          const limit = 2;
          const { statusCode, body } = await request(app)
            .get(`/api/v1/user?limit=${limit}`)
            .set("Authorization", `Bearer ${accessToken}`);

          expect(statusCode).toBe(200);
          expect(body.length).toBeLessThanOrEqual(limit);
        });
      });
    });
  });

  describe("get user by id", () => {
    describe("GET /api/v1/user/:id", () => {
      describe("given user is not authenticated", () => {
        it("should return a 401", async () => {
          const user = await createUser(generateRandomUser());

          const { statusCode } = await request(app).get(
            `/api/v1/user/${user._id}`
          );

          expect(statusCode).toBe(401);
        });
      });
    });

    describe("GET /api/v1/user/:id", () => {
      describe("given the user is not an admin", () => {
        it("should return a 403", async () => {
          const normalUser = await createUser(generateRandomUser());
          const anotherUser = await createUser(generateRandomUser());
          const { accessToken } = generateAuthTokens(normalUser.id);

          const { statusCode } = await request(app)
            .get(`/api/v1/user/${anotherUser._id}`)
            .set("Authorization", `Bearer ${accessToken}`);

          expect(statusCode).toBe(403);
        });
      });
    });

    describe("GET /api/v1/user/:id", () => {
      describe("given a user with a specific id don't exist", () => {
        it("should return a 404", async () => {
          const adminUser = await createUser(generateRandomUser("admin"));
          const anotherUser = await createUser(generateRandomUser());
          const { accessToken } = generateAuthTokens(adminUser.id);
          const fakeId = reverseString(anotherUser.id);

          const { statusCode } = await request(app)
            .get(`/api/v1/user/${fakeId}`)
            .set("Authorization", `Bearer ${accessToken}`);

          expect(statusCode).toBe(404);
        });
      });
    });

    describe("GET /api/v1/user/:id", () => {
      describe("given a user with a specific id exist", () => {
        it("should return a 200 and the user", async () => {
          const adminUser = await createUser(generateRandomUser("admin"));
          const { accessToken } = generateAuthTokens(adminUser.id);
          const user = await createUser(generateRandomUser());
          const { statusCode, body } = await request(app)
            .get(`/api/v1/user/${user._id}`)
            .set("Authorization", `Bearer ${accessToken}`);

          expect(statusCode).toBe(200);
          expect(body._id).toEqual(user.id);
        });
      });
    });
  });

  describe("update user by id", () => {
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
          expect(body._id).not.toEqual(update.name);
        });
      });
    });

    describe("PUT /api/v1/user/:id", () => {
      describe("given the user is authorized as the correct user but trying to change to a duplicate email", () => {
        it("should return a 409", async () => {
          const existingUser = await createUser(generateRandomUser());
          const userInfo = generateRandomUser();
          const user = await createUser(userInfo);
          const update = { email: existingUser.email };
          const { accessToken } = generateAuthTokens(user.id);

          const { statusCode } = await request(app)
            .put(`/api/v1/user/${user._id}`)
            .set("Authorization", `Bearer ${accessToken}`) //sending an access token with the request so that the user is authorized
            .send(update);

          expect(statusCode).toBe(409);
        });
      });
    });

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

  describe("delete user by id", () => {
    describe("DELETE /api/v1/user/:id", () => {
      describe("given the user is not authorized", () => {
        it("should return a 401 and not delete the user", async () => {
          const user = await createUser(generateRandomUser());

          const { statusCode } = await request(app).delete(
            `/api/v1/user/${user._id}`
          );
          const notDeletedUser = await findUserById(user.id);

          expect(statusCode).toBe(401);
          expect(notDeletedUser).not.toBe(null);
        });
      });
    });

    describe("DELETE /api/v1/user/:id", () => {
      describe("given the user is trying to delete someone else's profile", () => {
        it("should return a 403", async () => {
          const user1 = await createUser(generateRandomUser());
          const user2 = await createUser(generateRandomUser());
          const { accessToken } = generateAuthTokens(user2.id); //logging in as user2

          const { statusCode } = await request(app)
            .delete(`/api/v1/user/${user1._id}`) //but trying to delete user1's profile
            .set("Authorization", `Bearer ${accessToken}`);

          const notDeletedUser = await findUserById(user1.id);

          expect(statusCode).toBe(403);
          expect(notDeletedUser).not.toBe(null);
        });
      });
    });

    describe("DELETE /api/v1/user/:id", () => {
      describe("given the user is authorized as the correct user", () => {
        it("should return a 200 and delete the user", async () => {
          const user = await createUser(generateRandomUser());
          const { accessToken } = generateAuthTokens(user.id);

          const { statusCode } = await request(app)
            .delete(`/api/v1/user/${user._id}`)
            .set("Authorization", `Bearer ${accessToken}`); //sending an access token with the request so that the user is authorized

          const deletedUser = await findUserById(user.id);

          expect(statusCode).toBe(200);
          expect(deletedUser).toBe(null);
        });
      });
    });
  });
});
