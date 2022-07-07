import { ErrorRequestHandler } from "express";

//skipcq: no-unused-vars
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status: number = err.status || 500;
  const context: string = err.context || "unknown-context";
  let message = "";
  try {
    message = JSON.parse(err.msg);
  } catch (e) {
    message = err.msg || "Something went wrong";
  }

  return res.status(status).json({
    error: true,
    status,
    context,
    message,
    // stack: err.stack || "",
  });
};

export default errorHandler;
