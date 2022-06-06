import connectDB from "./utils/connectDB";
import app from "./utils/app";
import log from "./utils/logger";

const host: string = process.env.HOST;
const port: number = process.env.PORT;

app.listen(port, async () => {
  log.info(`server running on ${host}:${port}`);

  await connectDB();
});
