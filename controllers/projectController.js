const Project = require("../models/projectModel");
const User = require("../models/userModel");
const Assignment = require("../models/assignmentModel");

//Start Project
const startProject = async (req, res) => {
  const uploadData = req.body;
  try {
    //fetch tutor id
    const tutorObjectId = req.user.id;
    //fetch user to get tutorid and tutor name
    const user = await User.findById(tutorObjectId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const tutorName = user.name;

    //fetch assignment to get title
    const assigmnet = await Assignment.findById(uploadData.assignmentId);
    if (!assigmnet) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    const projectName = assigmnet.title;
    const studentId = assigmnet.studentId;
    studentName = assigmnet.studentName;
    //fetch student data
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    // const studentName = student.studentName;

    //set audto completion date if not given
    expectedCompletionDate = uploadData.expectedCompletionDate;
    if (!expectedCompletionDate) {
      expectedCompletionDate = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days from now
    }
    //create new object
    const newProject = new Project({
      assignmentId: uploadData.assignmentId,
      projectName,
      tutorId: tutorObjectId,
      tutorName,
      studentId,
      studentName,
      finalRate: uploadData.finalRate,
      expectedCompletionDate,
    });
    //save new project
    const savedProject = await newProject.save();
    console.log(savedProject);

    // return success response
    res
      .status(200)
      .json({ message: "project started successfully", savedProject });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = startProject;
