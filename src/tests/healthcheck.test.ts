import request from "supertest";
import app from "../utils/app";

describe("healthcheck", () => {
  describe("GET /api/v1/healthcheck/", () => {
    describe("given the server is working", () => {
      it("should return a 200", async () => {
        const { statusCode } = await request(app).get(`/api/v1/healthcheck/`);
        expect(statusCode).toBe(200);
      });
    });
  });
});
