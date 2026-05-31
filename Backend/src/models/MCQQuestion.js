const mongoose = require("mongoose");

const mcqSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    subcategory: {
      type: String,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
    },

    question: {
      type: String,
      required: true,
    },

    options: [String],

    correctAnswer: String,

    marks: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("MCQ", mcqSchema);
