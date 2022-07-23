import connectDB from "./utils/connectDB";
import app from "./utils/app";
import log from "./utils/logger";
import gracefulShutdownHandler from "./utils/gracefulShutdownHandler";
import connectRedis from "./utils/redis";

const host: string = process.env.HOST;
const port: number = process.env.PORT;

const server = app.listen(port, async () => {
  log.info(
    `server running on ${host}:${port} and process ID is ${process.pid}`
  );
  await connectDB();
  await connectRedis();
});

process.on("SIGINT", gracefulShutdownHandler);
process.on("SIGTERM", gracefulShutdownHandler);

export default server;
