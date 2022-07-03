import express, { Express } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import errorHandler from "../middlewares/errorHandler";
import cors from "cors";

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

app.use(cors({ origin: process.env.clientURL }));

//Routes
app.use("/api/v1/healthcheck", healthcheck);
app.use("/api/v1/user", user);
app.use("/api/v1/auth", auth);
app.use("/api/v1/product", product);
app.use("/api/v1/order", order);

app.use(errorHandler);

export default app;
