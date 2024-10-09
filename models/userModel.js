const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  role: { type: String, enum: ["tutor", "student"], required: true },
  phoneNumber: { type: Number },
});

const userModel = new mongoose.model("users", userSchema);

module.exports = userModel;
