const { ApiError } = require("../utils/apiResponse");

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json(new ApiError(403, "Access denied. Insufficient permissions."));
    }
    next();
  };
};

module.exports = roleMiddleware;
