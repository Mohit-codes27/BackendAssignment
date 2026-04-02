const mongoose = require("mongoose");
const Record = require("../models/record.model");
const { ApiResponse } = require("../utils/apiResponse");

// Build a $match stage: admins see all records, others see only their own
const buildMatchStage = (user) => {
  if (user.role === "admin") return {};
  return { userId: new mongoose.Types.ObjectId(user.id) };
};

// Get dashboard stats
const getSummary = async (req, res, next) => {
  try {
    const matchStage = buildMatchStage(req.user);

    const data = await Record.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    let income = 0;
    let expense = 0;

    data.forEach((item) => {
      if (item._id === "income") income = item.total;
      if (item._id === "expense") expense = item.total;
    });

    res.json(new ApiResponse(
      200,
      "Dashboard stats fetched successfully",
      {
        totalIncome: income,
        totalExpense: expense,
        netBalance: income - expense,
      }
    ));
  } catch (err) {
    next(err);
  }
};

const getCategoryData = async (req, res, next) => {
  try {
    const matchStage = buildMatchStage(req.user);

    const data = await Record.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.json(new ApiResponse(
      200,
      "Category data fetched successfully",
      data
    ));
  } catch (err) {
    next(err);
  }
};

const getTrends = async (req, res, next) => {
  try {
    const matchStage = buildMatchStage(req.user);

    const data = await Record.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { month: { $month: "$date" } },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    res.json(new ApiResponse(
      200,
      "Trends data fetched successfully",
      data
    ));
  } catch (err) {
    next(err);
  }
};

module.exports = { getSummary, getCategoryData, getTrends };
