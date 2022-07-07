import mongoose from "mongoose";
import log from "./logger";
import server from "../server";

const gracefulShutdownHandler = (signal: "SIGINT" | "SIGTERM") => {
  log.info(`${signal} received. Exiting...`);

  server.close(() => {
    log.info("Server closed");
    mongoose.connection.close(false, () => {
      log.info("MongoDB disconnected");
      process.exit(0);
    });
  });
};

export default gracefulShutdownHandler;
