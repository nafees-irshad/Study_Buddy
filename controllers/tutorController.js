const Tutor = require("../models/tutorModel");
const User = require("../models/userModel");

const insertTutorData = async (req, res) => {
  const {
    bio,
    subjects,
    qualification,
    pricingModel,
    rate,
    paymentDetails,
    accountNo,
  } = req.body;
  try {
    //fetch user id
    const userId = req.user.id;

    //check user availablity
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    //fetch username for tutor id
    const userName = user.userName;
    // Create a new Tutor object with the received data and the fetched userId
    const newTutor = new Tutor({
      userId: user._id,
      tutorId: userName,
      bio,
      subjects,
      qualification,
      pricingModel,
      rate,
      paymentDetails,
      accountNo,
    });

    // Save the new Tutor object to the database
    const savedTutor = await newTutor.save();

    // Return a success response with the saved tutor data
    res.status(201).json({
      message: "Tutor profile created successfully",
      tutor: savedTutor,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = insertTutorData;
