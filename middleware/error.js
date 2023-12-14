import ErrorHandler from "../utils/errorHandler.js";

const CustomErrorTypes = {
  CastError: "CastError",
  DuplicateKey: "DuplicateKeyError",
  JsonWebToken: "JsonWebTokenError",
  TokenExpired: "TokenExpiredError",
};

export const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  let errorInstance;

  // wrong mongodb id error
  if (err.name === CustomErrorTypes.CastError) {
    const message = `Resources not found with this id.. Invalid ${err.path}`;
    errorInstance = ErrorHandler(CustomErrorTypes.CastError, message, 400);
  }

  // Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate key ${Object.keys(err.keyValue)} Entered`;
    errorInstance = ErrorHandler(CustomErrorTypes.DuplicateKey, message, 400);
  }

  // wrong jwt error
  if (err.name === CustomErrorTypes.JsonWebToken) {
    const message = `Your URL is invalid, please try again later`;
    errorInstance = ErrorHandler(CustomErrorTypes.JsonWebToken, message, 400);
  }

  // jwt expired
  if (err.name === CustomErrorTypes.TokenExpired) {
    const message = `Your URL is expired, please try again later!`;
    errorInstance = ErrorHandler(CustomErrorTypes.TokenExpired, message, 400);
  }

  // If no custom error is matched, use the original error
  errorInstance = errorInstance || err;

  res.status(errorInstance.statusCode).json({
    success: false,
    message: errorInstance.message,
  });
};

export default errorMiddleware;
