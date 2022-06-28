interface customError extends Error {
  status?: number;
  context?: string;
}

const createError = (
  status?: number,
  context?: string,
  message?: string
): customError => {
  const err: customError = new Error();
  err.status = status;
  err.context = context;
  err.message = message || "Something went wrong";

  return err;
};

export default createError;
