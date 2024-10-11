const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  tutorId: { type: String, required: true },
  bio: { type: String, required: true },
  courses: [
    {
      Name: { type: String, required: true },
      Duration: { type: Number, default: 1, required: true }, // Duration of Each Session
      yearsOfExperience: { type: Number, required: true },
      Price: { type: Number, required: true }, //price per subject
      Rating: { type: Number, default: null }, // rating per subject
      totalRatings: {
        type: Number, // Count of how many ratings the tutor has received
        default: null,
      },
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
  availability: {
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },
    timeSlots: [
      {
        startTime: {
          type: String,
          enum: [
            "8:00 AM",
            "9:00 AM",
            "10:00 AM",
            "11:00 AM",
            "12:00 PM",
            "1:00 PM",
            "2:00 PM",
            "3:00 PM",
            "4:00 PM",
            "5:00 PM",
            "6:00 PM",
            "7:00 PM",
            "8:00 PM",
            "9:00 PM",
            "10:00 PM",
          ],
          required: true,
        },
        endTime: {
          type: String,
          enum: [
            "9:00 AM",
            "10:00 AM",
            "11:00 AM",
            "12:00 PM",
            "1:00 PM",
            "2:00 PM",
            "3:00 PM",
            "4:00 PM",
            "5:00 PM",
            "6:00 PM",
            "7:00 PM",
            "8:00 PM",
            "9:00 PM",
            "10:00 PM",
            "11:00 PM",
          ],
          required: true,
        },
      },
    ],
  },
  price: { type: Number, required: true },
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
  reviews: {
    type: [
      {
        rating: Number,
        reviewText: String,
      },
    ],
    default: null, // Set default to null
  },
});

const TutorModel = mongoose.model("tutors", tutorSchema);

module.exports = TutorModel;
