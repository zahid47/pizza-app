import connectDB from "./utils/connectDB";
import app from "./utils/app";
import log from "./utils/logger";
import gracefulShutdownHandler from "./utils/gracefulShutdownHandler";

const host: string = process.env.HOST;
const port: number = process.env.PORT;

const server = app.listen(port, async () => {
  await connectDB();
  log.info(`server running on ${host}:${port} & process ID is ${process.pid}`);
  log.info(`docs available at ${host}:${port}/api/v1/docs`);
});

process.on("SIGINT", gracefulShutdownHandler);
process.on("SIGTERM", gracefulShutdownHandler);

export default server;
