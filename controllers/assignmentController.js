const Assignment = require("../models/assignmentModel");
const User = require("../models/userModel");

// create Assignment
const uploadAssignment = async (req, res) => {
  const uploadData = req.body;
  try {
    //fetch user id
    const userId = req.user.id;

    //fetch user
    const user = await User.findById(userId);

    // Create a new assignment object
    const newAssignment = new Assignment({
      title: uploadData.title,
      description: uploadData.description,
      studentId: userId,
      studentName: user.name,
      deadline: uploadData.deadline,
      baseRate: uploadData.baseRate,
      subject: uploadData.subject,
      complexityLevel: uploadData.complexityLevel,
      assignmentType: uploadData.assignmentType,
      additionalInstructions: uploadData.additionalInstructions,
      keywords: uploadData.keywords,
      attachments: uploadData.attachments,
    });

    // Save the assignment to the database
    const savedAssignment = await newAssignment.save();

    res.status(201).json({
      message: "Assignment uploaded Successfully",
      data: savedAssignment,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = uploadAssignment;
