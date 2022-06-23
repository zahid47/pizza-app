const createError = (
  statusCode?: number,
  context?: string,
  message?: string
) => {
  const err: any = new Error();
  err.statusCode = statusCode;
  err.context = context;
  err.message = message;

  return err;
};

export default createError;
