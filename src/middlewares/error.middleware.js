const { ApiError } = require("../utils/apiResponse");

const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

module.exports = errorMiddleware;
