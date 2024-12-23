/** @format */

const Project = require("../models/projectModel");
const User = require("../models/userModel");
const Assignment = require("../models/assignmentModel");
const Tutor = require("../models/tutorModel");
const fs = require("fs-extra");
const path = require("path");
const multer = require("multer");

//Start Project
const startProject = async (req, res) => {
  const { assignmentId, expectedCompletionDate, finalRate } = req.body;
  try {
    //fetch tutor id
    const tutorObjectId = req.user.id;

    //fetch tutor as user
    const user = await User.findById(tutorObjectId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Tutor not found",
      });
    }
    const tutorName = user.name;

    //fetch assignment
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        status: "error",
        message: "Assignment closed or not found",
      });
    }
    //get student details
    const studentId = assignment.studentId;
    const studentName = assignment.studentName;

    //project name
    const projectName = assignment.title;

    //create new object for project
    const newProject = new Project({
      assignmentId,
      tutorId: tutorObjectId,
      tutorName,
      studentId,
      studentName,
      projectName,
      expectedCompletionDate,
      finalRate,
    });
    await newProject.save();

    //update ongoing projects
    const tutor = await Tutor.findOne({ userId: tutorObjectId });
    if (tutor) {
      tutor.onGoingPorjects += 1;
      await tutor.save();
    }
    res.status(201).json({
      status: "success",
      message: "proejct started successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Error starting project",
    });
  }
};

// Download Assignment and save it in 'downloads' folder
const downloadAssignment = async (req, res) => {
  const { id } = req.params;
  try {
    //Fetch the assignment by ID
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res
        .status(404)
        .json({ status: "error", message: "Assignment not found" });
    }
    // Find the project by ID
    const project = await Project.findOne({ assignmentId: id });
    if (!project) {
      return res
        .status(404)
        .json({ status: "error", message: "Project not found" });
    }

    const fileUrls = assignment.files.map((file) => file.fileUrl);
    // console.log(fileUrl);
    if (!fileUrls.length) {
      return res.status(404).json({
        status: "error",
        message: "No files found for this assignment",
      });
    }
    // Step 3: Resolve the File Paths
    const downloadFolder = path.resolve("downloads"); // Destination folder
    await fs.ensureDir(downloadFolder);

    const downloadedFiles = []; // To store successfully downloaded file paths
    // console.log(downloadedFiles);
    // Step 4: Copy each file to 'downloads' folder
    for (const fileUrl of fileUrls) {
      const originalFilePath = path.resolve(`.${fileUrl}`); // Original file path

      // Check if the file exists
      if (fs.existsSync(originalFilePath)) {
        const fileName = path.basename(fileUrl); // Extract file name
        const destinationPath = path.join(downloadFolder, fileName); // Destination path

        await fs.copy(originalFilePath, destinationPath); // Add to downloaded files list
        downloadedFiles.push({ fileName, fileUrl }); // Add to downloaded files list
      } else {
        console.warn(`File not found: ${originalFilePath}`);
      }
    }
    // console.log(downloadedFiles);
    // Update project files in the database
    if (project) {
      await Project.updateMany(
        { assignmentId: id },
        { $push: { files: downloadedFiles } }
      );
      assignment.status = "assigned";
      await assignment.save();
    }
    // Step 5: Send Success Response
    res.status(200).json({
      status: "success",
      message: "Files successfully downloaded",
      files: downloadedFiles,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Error downloading assignment");
  }
};

//update project
const updatePorject = async (req, res) => {
  const updates = req.body;
  const { id } = req.params;
  try {
    const updtaedProject = await Project.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!updtaedProject) {
      return res.status(404).json({
        status: "error",
        message: "Project not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Project updated successfubbly",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Error updating task",
    });
  }
};

//multer configuration for assignment submission
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Assignments");
  },

  filename: (req, file, cb) => {
    // Extract original file name and add date prefix
    const originalName = file.originalname.replace(/\s+/g, "_");
    const dateSuffix = new Date().toISOString().slice(0, 10);
    const fileName = `${dateSuffix}_${originalName}`;

    cb(null, fileName);
  },
});

//file filter for valid extension
const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".pdf", ".doc", ".docx", ".txt"];
  if (
    !allowedExtensions.includes(
      path.extname(file.originalname).toLocaleLowerCase()
    )
  ) {
    return cb(
      new Error(
        "Invalid file type. Only pdf, DOC, DOCX and TXT files are allowed"
      ),
      false
    );
  }
  cb(null, true);
};

// Multer Instance
const assignments = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array("solutionFiles", 5);

//submit assigmnet function
const submitAssignment = async (req, res) => {
  assignments(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        message: console.log(err),
        error: err.message,
      });
    }
    // Destructure additional fields
    const { finalRate, chargesOrDiscounts } = req.body;
    // console.log(req.body);
    try {
      // Check if files exist
      if (!req.solutionFiles || req.solutionFiles.length === 0) {
        return res.status(400).json({
          error: "At least one attachment is required",
        });
      }
      console.log(req.solutionFiles);
      // Save assignment details to DB
      const solutionFiles = req.solutionFiles.map((file) => ({
        fileName: file.originalname,
        fileUrl: `/Assignments/${file.filename}`,
      }));
      console.log(solutionFiles);

      //fetch tutor id
      const tutorId = req.user.id;

      //fetch tutor
      const tutor = await Tutor.findOne({ userId: tutorId });

      //check if project exist
      const project = await Project.findOne({ tutorId });
      if (!project) {
        return res.status({
          status: "error",
          message: "Project cancelled or not found",
        });
      }
      if (project) {
        project.actualCompletionDate = Date.now();
        project.projectStatus = "completed";
        project.solutionFiles = solutionFiles;
        project.finalRate = finalRate;
        project.chargesOrDiscounts = chargesOrDiscounts;
        await project.save();
      }
      if (tutor) {
        tutor.onGoingPorjects -= 1;
        tutor.completedProjects += 1;
        await tutor.save();
      }
      res.status(200).json({
        status: "success",
        message: "Assignment submitted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "Error submiting assignment",
      });
    }
  });
};

module.exports = {
  startProject,
  downloadAssignment,
  updatePorject,
  submitAssignment,
};
