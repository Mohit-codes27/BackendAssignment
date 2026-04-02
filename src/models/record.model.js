const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true
    },
    category: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    notes: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Record", recordSchema);
