import connectDB from "./utils/connectDB";
import app from "./utils/app";
import log from "./utils/logger";
import gracefulShutdownHandler from "./utils/gracefulShutdownHandler";
import http from "http";
import { Server } from "socket.io";

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

const host: string = process.env.HOST;
const port: number = process.env.PORT;

io.on("connection", (socket) => {
  log.info(`${socket.id} connected`);

  socket.on("disconnect", () => {
    log.info(`${socket.id} disconnected`);
  });

  socket.on("newOrder", (order) => {
    log.info(`${socket.id} placed a new order ${order._id}`);
    io.emit("newOrderPlaced", order);
  });

  socket.on("changeOrderStatus", (order) => {
    log.info(`${socket.id} changed status of order ${order._id} to ${order.status}`);
    io.emit("orderStatusChanged", order);
  });
});

const server = httpServer.listen(port, async () => {
  await connectDB();
  log.info(`server running on ${host}:${port} & process id is ${process.pid}`);
  log.info(`docs available at ${host}:${port}/api/v1/docs`);
});

process.on("SIGINT", gracefulShutdownHandler);
process.on("SIGTERM", gracefulShutdownHandler);

export default server;
