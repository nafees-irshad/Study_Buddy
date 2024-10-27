const Tutor = require("../models/tutorModel");
const User = require("../models/userModel");

const insertTutorData = async (req, res) => {
  const {
    bio,
    subjects,
    qualification,
    certification,
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
      certification,
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

const updateTutor = async (req, res) => {
  const {
    bio,
    qualification,
    subjects,
    certification,
    rate,
    paymentDetails,
    accountNo,
  } = req.body;
  const userId = req.user.id;
  try {
    //fetch tutor profile
    const tutor = await Tutor.findOne({ userId: userId });
    if (!tutor) {
      return res.status(404).json("Tutor not found");
    }
    if (bio) tutor.bio = bio;
    if (qualification) tutor.qualification = qualification;
    if (subjects && subjects.length) {
      tutor.subjects.push(...subjects); // Using spread operator to add new subjects
    }
    if (certification && certification.length) {
      tutor.certification.push(...certification); // Using spread operator to add new certifications
    }
    if (rate) tutor.rate = rate;
    if (paymentDetails) tutor.paymentDetails = paymentDetails;
    if (accountNo) tutor.accountNo = accountNo;
    await tutor.save();
    res.status(200).json({
      message: "profile updated successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal Server Error");
  }
};

module.exports = { insertTutorData, updateTutor };
