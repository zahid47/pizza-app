import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import errorHandler from "../middlewares/errorHandler";
import limiter from "../middlewares/rateLimit";

import docs from "../routes/api/v1/docs.route";
import healthcheck from "../routes/api/v1/healthcheck.route";
import user from "../routes/api/v1/user.route";
import auth from "../routes/api/v1/auth.route";
import product from "../routes/api/v1/product.route";
import order from "../routes/api/v1/order.route";

const app: Express = express();

if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: path.resolve(__dirname, "../.env.test") });
} else {
  dotenv.config({ path: path.resolve(__dirname, "../.env") });
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(limiter);
app.use(morgan("dev"));

app.get("/", (_req: Request, res: Response) => {
  return res.sendStatus(200);
});

//Routes
app.use("/api/v1/docs", docs);
app.use("/api/v1/healthcheck", healthcheck);
app.use("/api/v1/user", user);
app.use("/api/v1/auth", auth);
app.use("/api/v1/product", product);
app.use("/api/v1/order", order);

app.use(errorHandler);

export default app;
