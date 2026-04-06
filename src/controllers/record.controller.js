const Record = require("../models/record.model");
const { ApiResponse, ApiError } = require("../utils/apiResponse");

// Create a record
const createRecord = async (req, res, next) => {
  try {
    const record = await Record.create({
      ...req.body,
      userId: req.user.id,
    });
    return res.status(201)
      .json(new ApiResponse(
        201,
        "Record created successfully",
        record
      ));
  } catch (error) {
    next(error);
  }
};

// Get all records for the logged-in user
const getRecords = async (req, res, next) => {
  try {
    const { type, category, startDate, endDate } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    let filter = {};

    if(req.user.role !== "admin"){
      filter.userId = req.user.id;
    }

    if (type) filter.type = type;
    if (category) filter.category = category;

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const records = await Record.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ date: -1 });

    return res.status(200)
      .json(new ApiResponse(
        200,
        "Records fetched successfully",
        records
      ));
  } catch (error) {
    next(error);
  }
};

// Update a record
const updateRecord = async (req, res, next) => {
  try {
    const record = await Record.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!record) {
      throw new ApiError(404, "Record not found or unauthorized.");
    }

    return res.status(200)
      .json(new ApiResponse(
        200,
        "Record updated successfully",
        record
      ));
  } catch (error) {
    next(error);
  }
};

// Delete a record
const deleteRecord = async (req, res, next) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);

    if (!record) {
      throw new ApiError(404, "Record not found or unauthorized.");
    }

    return res.status(200)
      .json(new ApiResponse(
        200,
        "Record deleted successfully"
      ));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
};
