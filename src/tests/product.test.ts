// This test does not cover cloudinary image uploads.

import request from "supertest";
import app from "../utils/app";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Product from "../models/product.model";
import { createProduct, findProduct } from "../services/product.service";
import {
  generateRandomUser,
  generateRandomProduct,
  generateRandomImgURLs,
} from "./testUtils/randomGenerators";
import { generateAuthTokens } from "../services/auth.service";
import { createUser } from "../services/user.service";
import productSerializer from "../utils/productSerializer";
import { reverseString } from "./testUtils/reverseString";

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

  describe("create product", () => {
    describe("POST /api/v1/product/", () => {
      describe("given user is not authenticated", () => {
        it("should return a 401", async () => {
          const product = generateRandomProduct();
          const { statusCode } = await request(app)
            .post(`/api/v1/product`)
            .send(product);

          expect(statusCode).toBe(401);
        });
      });
    });

    describe("POST /api/v1/product/", () => {
      describe("given authorized user is not an admin", () => {
        it("should return a 403", async () => {
          const user = await createUser(generateRandomUser());
          const product = generateRandomProduct();
          const { accessToken } = generateAuthTokens(user.id, user.role);
          const { statusCode } = await request(app)
            .post(`/api/v1/product`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send(product);

          expect(statusCode).toBe(403);
        });
      });
    });

    describe("POST /api/v1/product/", () => {
      describe("given authorized user is an admin but didn't provide name and price info", () => {
        it("should return a 400 and not create a product", async () => {
          const user = await createUser(generateRandomUser("admin"));
          const { accessToken } = generateAuthTokens(user.id, user.role);
          const { statusCode, body } = await request(app)
            .post(`/api/v1/product`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send(); //sending nothing

          expect(statusCode).toBe(400);
          expect(body).not.toHaveProperty("name");
          expect(body.context).toEqual("validate");
        });
      });
    });

    describe("POST /api/v1/product/", () => {
      describe("given authorized user is an admin and provided name and price info", () => {
        it("should return a 400 and not create a product", async () => {
          const user = await createUser(generateRandomUser("admin"));
          let product: any = generateRandomProduct();
          product = { ...product, isCheap: true }; // adding an unacceptable property
          const { accessToken } = generateAuthTokens(user.id, user.role);
          const { statusCode, body } = await request(app)
            .post(`/api/v1/product`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send(product);

          expect(statusCode).toBe(400);
          expect(body).not.toHaveProperty("name");
          expect(body.context).toEqual("validate");
        });
      });
    });

    describe("POST /api/v1/product/", () => {
      describe("given authorized user is an admin and provided name and price info but provided extra unaccepted fields", () => {
        it("should return a 201 and create a product", async () => {
          const user = await createUser(generateRandomUser("admin"));
          const product = generateRandomProduct();
          const { accessToken } = generateAuthTokens(user.id, user.role);
          const { statusCode, body } = await request(app)
            .post(`/api/v1/product`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send(product);

          expect(statusCode).toBe(201);
          expect(body.name).toEqual(product.name);
        });
      });
    });
  });

  describe("get products", () => {
    describe("GET /api/v1/product/", () => {
      describe("given no product exists", () => {
        it("should return a 200 and an empty array", async () => {
          const { statusCode, body } = await request(app).get(
            `/api/v1/product`
          );

          expect(statusCode).toBe(200);
          expect(body.length).toEqual(0);
        });
      });
    });

    describe("GET /api/v1/product/", () => {
      describe("given some products do exist", () => {
        it("should return a 200 and less than or equal to 'limit' number of products", async () => {
          await createProduct(
            productSerializer(generateRandomProduct(), generateRandomImgURLs())
          );
          await createProduct(
            productSerializer(generateRandomProduct(), generateRandomImgURLs())
          );
          await createProduct(
            productSerializer(generateRandomProduct(), generateRandomImgURLs())
          );

          const limit = 2;
          const { statusCode, body } = await request(app).get(
            `/api/v1/product?limit=${limit}`
          );

          expect(statusCode).toBe(200);
          expect(body.length).toBeLessThanOrEqual(limit);
        });
      });
    });
  });

  describe("get product by id", () => {
    describe("GET /api/v1/product/:id", () => {
      describe("given no product with that id doesn't exist", () => {
        it("should return a 404", async () => {
          const product = await createProduct(
            productSerializer(generateRandomProduct(), generateRandomImgURLs())
          );
          const fakeId = reverseString(product.id);

          const { statusCode } = await request(app).get(
            `/api/v1/product/${fakeId}`
          );

          expect(statusCode).toBe(404);
        });
      });
    });

    describe("GET /api/v1/product/:id", () => {
      describe("given a product with that id do exist", () => {
        it("should return a 200 and the product", async () => {
          const product = await createProduct(
            productSerializer(generateRandomProduct(), generateRandomImgURLs())
          );

          const { statusCode, body } = await request(app).get(
            `/api/v1/product/${product.id}`
          );

          expect(statusCode).toBe(200);
          expect(body._id).toEqual(product.id);
        });
      });
    });
  });

  describe("update product by id", () => {
    describe("PUT /api/v1/product/:id", () => {
      describe("given user is unauthorized", () => {
        it("should return a 401 and not update the product", async () => {
          const product = await createProduct(
            productSerializer(generateRandomProduct(), generateRandomImgURLs())
          );
          const updated = { name: "updated" };

          const { statusCode, body } = await request(app)
            .put(`/api/v1/product/${product.id}`)
            .send(updated);

          expect(statusCode).toBe(401);
          expect(body.name).not.toEqual(updated.name);
        });
      });
    });

    describe("PUT /api/v1/product/:id", () => {
      describe("given authorized user is not an admin", () => {
        it("should return a 403 and not update the product", async () => {
          const user = await createUser(generateRandomUser());
          const product = await createProduct(
            productSerializer(generateRandomProduct(), generateRandomImgURLs())
          );
          const updated = { name: "updated" };
          const { accessToken } = generateAuthTokens(user.id, user.role);

          const { statusCode, body } = await request(app)
            .put(`/api/v1/product/${product.id}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send(updated);

          expect(statusCode).toBe(403);
          expect(body.name).not.toEqual(updated.name);
        });
      });
    });

    describe("PUT /api/v1/product/:id", () => {
      describe("given authorized user is an admin", () => {
        it("should return a 200 and update the product", async () => {
          const user = await createUser(generateRandomUser("admin"));
          const product = await createProduct(
            productSerializer(generateRandomProduct(), generateRandomImgURLs())
          );
          const updated = { name: "updated" };
          const { accessToken } = generateAuthTokens(user.id, user.role);

          const { statusCode, body } = await request(app)
            .put(`/api/v1/product/${product.id}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send(updated);

          expect(statusCode).toBe(200);
          expect(body.name).toEqual(updated.name);
        });
      });
    });
  });

  describe("delete product by id", () => {
    describe("DELETE /api/v1/product/:id", () => {
      describe("given user is not authenticated", () => {
        it("should return a 401 and not delete the product", async () => {
          const product = await createProduct(
            productSerializer(generateRandomProduct(), generateRandomImgURLs())
          );

          const { statusCode } = await request(app).delete(
            `/api/v1/product/${product.id}`
          );

          const notDeletedProduct = await findProduct(product.id);

          expect(statusCode).toBe(401);
          expect(notDeletedProduct).not.toBe(null);
        });
      });
    });

    describe("DELETE /api/v1/product/:id", () => {
      describe("given authorized user is not an admin", () => {
        it("should return a 403 and not delete the product", async () => {
          const user = await createUser(generateRandomUser());
          const product = await createProduct(
            productSerializer(generateRandomProduct(), generateRandomImgURLs())
          );
          const { accessToken } = generateAuthTokens(user.id, user.role);

          const { statusCode } = await request(app)
            .delete(`/api/v1/product/${product.id}`)
            .set("Authorization", `Bearer ${accessToken}`);

          const notDeletedProduct = await findProduct(product.id);

          expect(statusCode).toBe(403);
          expect(notDeletedProduct).not.toBe(null);
        });
      });
    });

    describe("DELETE /api/v1/product/:id", () => {
      describe("given authorized user is an admin", () => {
        it("should return a 200 and delete the product", async () => {
          const user = await createUser(generateRandomUser("admin"));
          const product = await createProduct(
            productSerializer(generateRandomProduct(), generateRandomImgURLs())
          );
          const { accessToken } = generateAuthTokens(user.id, user.role);

          const { statusCode } = await request(app)
            .delete(`/api/v1/product/${product.id}`)
            .set("Authorization", `Bearer ${accessToken}`);

          const deletedProduct = await findProduct(product.id);

          expect(statusCode).toBe(200);
          expect(deletedProduct).toBe(null);
        });
      });
    });
    
  });
});
