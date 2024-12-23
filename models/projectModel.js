const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tutorName: {
    type: String,
    required: true,
  },
  assignmentId: { type: String, required: true },
  projectName: { type: String, required: true },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  expectedCompletionDate: {
    type: Date,
    required: true,
  },
  actualCompletionDate: {
    type: Date,
    default: null,
  },
  projectStatus: {
    type: String,
    enum: ["inProgress", "completed", "cancelled"],
    default: "inProgress",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  finalRate: {
    type: Number,
  },
  chargesOrDiscounts: {
    type: String,
    enum: ["charges", "discount"],
    default: null,
  },
  remarks: {
    type: String,
    default: null,
  },
  files: [
    {
      fileName: { type: String },
      fileUrl: { type: String },
    },
  ],
  solutionFiles: [
    {
      fileName: { type: String },
      fileUrl: { type: String },
    },
  ],
});

module.exports = new mongoose.model("projects", projectSchema);
