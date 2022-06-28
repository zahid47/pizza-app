import request from "supertest";
import app from "../utils/app";

describe("healthcheck", () => {
  describe("GET /api/v1/healthcheck/", () => {
    describe("given the server is working", () => {
      it("should return a 200 and success should be true", async () => {
        const { statusCode, body } = await request(app).get(
          `/api/v1/healthcheck/`
        );

        expect(statusCode).toBe(200);
        expect(body.success).toBe(true);
      });
    });
  });
});
