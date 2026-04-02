const jwt = require("jsonwebtoken");
const { ApiError } = require("../utils/apiResponse");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "Access denied. No token provided.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    }
    return res.status(401).json(new ApiError(401, "Invalid token."));
  }
};

module.exports = authMiddleware;
