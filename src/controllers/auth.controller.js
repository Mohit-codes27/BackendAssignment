const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ApiResponse, ApiError } = require("../utils/apiResponse");

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "User already exists with this email.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    const token = jwt.sign({ 
      id: user._id, 
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
    );

    return res.status(201)
    .json(new ApiResponse(
      201,
      "User registered successfully",
      { token }
    ));
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(401, "Invalid email or password.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid email or password.");
    }

    const token = jwt.sign({ 
      id: user._id, 
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
    );

    return res.status(200)
    .json(new ApiResponse(
      200,
      "Login successful",
      { token }
    ));
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
