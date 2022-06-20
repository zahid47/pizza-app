export interface errType extends Error {
  status?: number;
}

const createError = (status: number, message: string) => {
  const err: errType = new Error();
  err.status = status;
  err.message = message;

  return err;
};

export default createError;
