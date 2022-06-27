import connectDB from "./utils/connectDB";
import app from "./utils/app";
import log from "./utils/logger";
import gracefulShutdownHandler from "./utils/gracefulShutdownHandler";
import mongoose from "mongoose";

const host: string = process.env.HOST;
const port: number = process.env.PORT;

const server = app.listen(port, async () => {
  log.info(
    `server running on ${host}:${port} and process ID is ${process.pid}`
  );
  await connectDB();
});

process.on("SIGINT", () => {
  log.info(`SIGINT received. Exiting...`);
  server.close(() => {
    log.info("Server closed");
    mongoose.connection.close(false, () => {
      log.info("MongoDB disconnected");
      process.exit(0);
    });
  });
});

process.on("SIGTERM", () => {
  log.info(`SIGTERM received. Exiting...`);
  server.close(() => {
    log.info("Server closed");
    mongoose.connection.close(false, () => {
      log.info("MongoDB disconnected");
      process.exit(0);
    });
  });
});

export default server;
