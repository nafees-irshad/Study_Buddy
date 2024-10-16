const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  studentName: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  deadline: { type: Date, required: true },
  deadlineChanges: [
    {
      previousDeadline: { type: Date },
      updatedDeadline: { type: Date },
      updatedAt: { type: Date, default: Date.now },
    },
  ], // To track each change
  baseRate: { type: Number, required: true },
  negotiabale: { type: Boolean, default: true },
  subject: { type: String, required: true },
  complexityLevel: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    required: true,
  },
  assignmentType: {
    type: String,
    enum: ["homework", "essay", "research project", "other"],
    required: true,
  },
  additionalInstructions: { type: String },
  status: {
    type: String,
    enum: ["open", "closed", "assigned"],
    default: "open",
  },
  keywords: { type: [String], required: true },
  attachments: [
    {
      fileName: { type: String, required: true },
      fileUrl: { type: String, required: true },
    },
  ],
});

module.exports = new mongoose.model("assignment", assignmentSchema);
