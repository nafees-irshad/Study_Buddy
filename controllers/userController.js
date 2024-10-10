const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();

//resgister user (signup)
const registerUser = async (req, res) => {
  const { userName, name, email, password, role, phoneNumber } = req.body;
  try {
    //check User Availblity
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        status: "failed",
        message: "Email already exists.",
      });
    }
    // Generate user name if not provided
    const newUserName = userName || email.split("@")[0];
    //check user name ;
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({
        message: "User name is already taken. Please choose another one.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      userName: newUserName,
      name,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
    });
    // Save user to database
    const savedUser = await newUser.save();
    res.status(200).json({
      status: "success",
      message: "User created successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "failed",
      message: "Error in registration",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // check user availablity by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found.",
      });
    }
    // validating password
    const isvalidPassword = await bcrypt.compare(password, user.password);
    if (!isvalidPassword) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid password.",
      });
    }
    //generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "3d",
    });
    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "failed", message: "login error" });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    // Validate Password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      return res.status(400).json({
        status: "failed",
        message: "Wrong password",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const newHashPassword = await bcrypt.hash(newPassword, salt);
    user.password = newHashPassword;
    await user.save();
    res.send({
      status: "sucess",
      message: "Password changed successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "failed",
      message: "Error changing password",
    });
  }
};

const updateUser = async (req,res)=>{
  const updates = req.body;
  try{
    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      {$set: updates},
      {new: true, runValidators: true}
    ).select("-password");

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: updateUser,
    });

    if (!updateUser) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }
  }catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "An error occurred while updating the user",
    });
  }
}

module.exports = { registerUser, loginUser, changePassword, updateUser };
