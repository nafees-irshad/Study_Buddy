const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  tutorId: { type: String, required: true },
  bio: { type: String, required: true },
  subjects: [
    {
      name: { type: String, required: true },
      yearsOfExperience: { type: Number, required: true },
      Price: { type: Number, required: true }, //price per subject
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date },
    },
  ],
  qualification: {
    degree: {
      type: String,
      enum: ["highSchool", "intermediate", "Bachelors", "Masters", "PHD"],
      required: true,
    },
  },
  certification: [
    {
      title: String, // Name of the certification
      institution: String, // Institution that provided the certification
      year: Number, // Year when certification was obtained
    },
  ],
  verifiedStatus: { type: Boolean, default: false },
  pricingModel: {
    type: String,
    enum: ["per hour", "per assignment", "per project"],
    required: true,
    default: "per assignment",
  },
  rate: { type: Number, required: true },
  onGoingPorjects: {
    type: [],
    default: [],
  },
  completedProjects: {
    type: [],
    default: [],
  },
  paymentDetails: {
    type: String,
    enum: ["easyPaisa", "JazzCash", "Debit Card", "Bank Account"],
    required: true,
  },
  accountNo: { type: String, required: true },
  totalIncome: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null,
      },
      rating: { type: Number, default: null },
      reviewText: { type: String, default: null },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const TutorModel = mongoose.model("tutors", tutorSchema);

module.exports = TutorModel;
