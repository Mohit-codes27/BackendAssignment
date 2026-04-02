const User = require("../models/user.model");
const { ApiResponse, ApiError } = require("../utils/apiResponse");

// Get all users (admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200)
      .json(new ApiResponse(
        200,
        "Users fetched successfully",
        users
      ));
  } catch (error) {
    next(error);
  }
};

// Toggle user status (activate/deactivate)
const toggleUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      throw new ApiError(400, "Status must be 'active' or 'inactive'.");
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    return res.status(200)
      .json(new ApiResponse(
        200,
        `User ${status === "active" ? "activated" : "deactivated"} successfully`,
        user
      ));
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, toggleUserStatus };
