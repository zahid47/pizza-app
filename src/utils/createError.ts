interface customError extends Error {
  status?: number;
  context?: string;
  msg?: string;
}

const createError = (
  status?: number,
  context?: string,
  message?: string
): customError => {
  const err: customError = new Error();

  err.status = status;
  err.context = context;
  err.msg = message;

  return err;
};

export default createError;
