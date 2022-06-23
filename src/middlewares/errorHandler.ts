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
  const message: string = err.message || "Something went wrong";

  return res.status(status).json({
    success: false,
    error: true,
    status,
    context,
    message,
    // stack: err.stack || "",
  });
};

export default errorHandler;
