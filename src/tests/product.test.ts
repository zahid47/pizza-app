// import request from "supertest";
// import app from "../utils/app";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Product from "../models/product.model";
// import { createProduct, findProduct } from "../services/product.service";
// import { generateRandomProduct } from "./testUtils/randomGenerators";

//TODO complete the tests
describe("product", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    await Product.deleteMany({});
  });

  beforeEach(async () => {
    await Product.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("sanity check", () => {
    it("has a moddule", () => {
      expect(Product).toBeDefined();
    });
  });

  // describe("POST /api/v1/product/", () => {
  //   describe("given name, email, password is not provided", () => {
  //     it("should return a 400", async () => {
  //       const { statusCode } = await request(app)
  //         .post(`/api/v1/product`)
  //         .send(); //sending nothing
  //       expect(statusCode).toBe(400);
  //     });
  //   });
  // });

  // describe("POST /api/v1/product/", () => {
  //   describe("given name and price info is provided", () => {
  //     it("should return a 201 and create a product", async () => {
  //       const product = generateRandomProduct();
  //       const { statusCode, body } = await request(app)
  //         .post(`/api/v1/product`)
  //         .send(product);
  //       expect(statusCode).toBe(201);
  //       expect(body.name).toEqual(product.name);
  //     });
  //   });
  // });

  // describe("POST /api/v1/product/", () => {
  //   describe("given extra fields are provided", () => {
  //     it("should return a 400", async () => {
  //       let product: any = generateRandomProduct();
  //       product = { ...product, verified: true };

  //       const { statusCode } = await request(app)
  //         .post(`/api/v1/product`)
  //         .send(product);
  //       expect(statusCode).toBe(400);
  //     });
  //   });
  // });

  // describe("GET /api/v1/product", () => {
  //   describe("given no product exist", () => {
  //     it("should return a 200 and an empty array", async () => {
  //       const { statusCode, body } = await request(app).get(`/api/v1/product`);
  //       expect(statusCode).toBe(200);
  //       expect(body.length).toEqual(0);
  //     });
  //   });
  // });

  // describe("GET /api/v1/product", () => {
  //   describe("given some users exist", () => {
  //     it("should return a 200 and less than or equal to 'limit' number of users", async () => {
  //       await createProduct(generateRandomProduct());
  //       await createProduct(generateRandomProduct());
  //       await createProduct(generateRandomProduct());

  //       const limit = 2;
  //       const { statusCode, body } = await request(app).get(
  //         `/api/v1/product?limit=${limit}`
  //       );
  //       expect(statusCode).toBe(200);
  //       expect(body.length).toBeLessThanOrEqual(limit);
  //     });
  //   });
  // });

  // describe("GET /api/v1/product/:id", () => {
  //   describe("given a product with a specific id don't exist", () => {
  //     it("should return a 404", async () => {
  //       const fakeId = "62aca583712384e283ebae8c";
  //       const { statusCode } = await request(app).get(
  //         `/api/v1/product/${fakeId}`
  //       );
  //       expect(statusCode).toBe(404);
  //     });
  //   });
  // });

  // describe("GET /api/v1/product/:id", () => {
  //   describe("given a product with a specific id exist", () => {
  //     it("should return a 200 and the product", async () => {
  //       const product = await createProduct(generateRandomProduct());
  //       const { statusCode, body } = await request(app).get(
  //         `/api/v1/product/${product._id}`
  //       );
  //       expect(statusCode).toBe(200);
  //       expect(body.name).toEqual(product.name);
  //     });
  //   });
  // });

  // describe("PUT /api/v1/product/:id", () => {
  //   describe("given the product is not authorized", () => {
  //     it("should return a 401 and not update the product", async () => {
  //       const product = await createProduct(generateRandomProduct());
  //       const updated = { name: "updated" };

  //       const { statusCode, body } = await request(app)
  //         .put(`/api/v1/product/${product._id}`)
  //         .send(updated);

  //       expect(statusCode).toBe(401);
  //       expect(body.name).not.toEqual(updated.name);
  //     });
  //   });
  // });

  // describe("PUT /api/v1/product/:id", () => {
  //   describe("given the product is trying to update someone else's profile", () => {
  //     it("should return a 403", async () => {
  //       const user1 = await createProduct(generateRandomProduct());
  //       const user2 = await createProduct(generateRandomProduct());
  //       const update = { name: "updated" };
  //       const { accessToken } = generateAuthTokens(user2.id); //logging in as user2

  //       const { statusCode, body } = await request(app)
  //         .put(`/api/v1/product/${user1._id}`) //but trying to update user1's profile
  //         .set("Authorization", `Bearer ${accessToken}`)
  //         .send(update);

  //       expect(statusCode).toBe(403);
  //       expect(body.name).not.toEqual(update.name);
  //     });
  //   });
  // });

  // describe("PUT /api/v1/product/:id", () => {
  //   describe("given the product is authorized as the correct product", () => {
  //     it("should return a 200 and update the product", async () => {
  //       const userInfo = generateRandomProduct();
  //       const product = await createProduct(userInfo);
  //       const update = { name: "updated" };
  //       const { accessToken } = generateAuthTokens(product.id);

  //       const { statusCode, body } = await request(app)
  //         .put(`/api/v1/product/${product._id}`)
  //         .set("Authorization", `Bearer ${accessToken}`) //sending an access token with the request so that the product is authorized
  //         .send(update);

  //       expect(statusCode).toBe(200);
  //       expect(body.name).toEqual(update.name);
  //     });
  //   });
  // });

  // describe("DELETE /api/v1/product/:id", () => {
  //   describe("given the product is not authorized", () => {
  //     it("should return a 401 and not delete the product", async () => {
  //       const product = await createProduct(generateRandomProduct());

  //       const { statusCode } = await request(app).delete(
  //         `/api/v1/product/${product._id}`
  //       );
  //       const notDeletedUser = await findProduct(product.id);

  //       expect(statusCode).toBe(401);
  //       expect(notDeletedUser).not.toBe(null);
  //     });
  //   });
  // });

  // describe("DELETE /api/v1/product/:id", () => {
  //   describe("given the product is trying to delete someone else's profile", () => {
  //     it("should return a 403", async () => {
  //       const user1 = await createProduct(generateRandomProduct());
  //       const user2 = await createProduct(generateRandomProduct());
  //       const { accessToken } = generateAuthTokens(user2.id); //logging in as user2

  //       const { statusCode } = await request(app)
  //         .delete(`/api/v1/product/${user1._id}`) //but trying to delete user1's profile
  //         .set("Authorization", `Bearer ${accessToken}`);

  //       const notDeletedUser = await findProduct(user1.id);

  //       expect(statusCode).toBe(403);
  //       expect(notDeletedUser).not.toBe(null);
  //     });
  //   });
  // });

  // describe("DELETE /api/v1/product/:id", () => {
  //   describe("given the product is authorized as the correct product", () => {
  //     it("should return a 200 and delete the product", async () => {
  //       const product = await createProduct(generateRandomProduct());
  //       const { accessToken } = generateAuthTokens(product.id);

  //       const { statusCode } = await request(app)
  //         .delete(`/api/v1/product/${product._id}`)
  //         .set("Authorization", `Bearer ${accessToken}`); //sending an access token with the request so that the product is authorized

  //       const deletedUser = await findProduct(product.id);

  //       expect(statusCode).toBe(200);
  //       expect(deletedUser).toBe(null);
  //     });
  //   });
  // });
});
