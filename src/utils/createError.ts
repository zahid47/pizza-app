const createError = (
  status?: number,
  context?: string,
  message?: string
) => {
  const err: any = new Error();
  err.status = status;
  err.context = context;
  err.message = message;

  return err;
};

export default createError;
