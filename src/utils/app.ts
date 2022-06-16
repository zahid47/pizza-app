import express, { Express } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";

import healthcheck from "../routes/api/v1/healthcheck.route";
import user from "../routes/api/v1/user.route";
import auth from "../routes/api/v1/auth.route"

const app: Express = express();
dotenv.config({ path: path.resolve(__dirname, "../.env") });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes
app.use("/api/v1/healthcheck", healthcheck);
app.use("/api/v1/user", user);
app.use("/api/v1/auth", auth);

export default app;
