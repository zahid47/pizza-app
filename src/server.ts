import connectDB from "./utils/connectDB";
import app from "./utils/app";

const host: string = process.env.HOST;
const port: number = process.env.PORT;

app.listen(port, async () => {
  console.log(`server running on ${host}:${port}`);

  await connectDB();
});
