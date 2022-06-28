import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: any, //FIXME whats the type of this err? IDK
  _req: Request,
  res: Response,
  //skipcq
  _next: NextFunction
) => {
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
