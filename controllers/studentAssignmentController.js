const multer = require("multer");
const path = require("path");
const Assignment = require("../models/assignmentModel");
const User = require("../models/userModel");

//multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); //directory where files will be stored
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
  const allowedExtensions = [".pdf", ".doc", "docx", ".txt"];
  if (
    !allowedExtensions.includes(path.extname(file.originalname).toLowerCase())
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
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, //limit filesize to 5mb
}).array("files", 5); // Allow up to 5 files with the field name "attachments"

//upload Assigment function
const uploadAssignment = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        message: console.log(err),
        error: err.message,
      });
    }
    // Destructure additional fields
    const {
      title,
      description,
      deadline,
      baseRate,
      subject,
      complexityLevel,
      assignmentType,
    } = req.body;
    // console.log(req.body);
    try {
      // Check if files exist
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          error: "At least one attachment is required.",
        });
      }

      // Ensure at least 3 keywords are provided
      let keywordsArray = Array.isArray(req.body.keywords)
        ? req.body.keywords
        : [req.body.keywords];
      if (keywordsArray.length < 3) {
        return res.status(400).json({
          error: "At least 3 keywords are required.",
        });
      }

      // Save assignment details to DB (Example Schema)
      const files = req.files.map((file) => ({
        fileName: file.originalname,
        fileUrl: `/uploads/${file.filename}`,
      }));
      //fetch student id
      const studentId = req.user._id;
      //find student
      const student = await User.findById(studentId);

      //create new assignment object
      const newAssignment = new Assignment({
        studentId,
        studentName: student.name,
        title,
        description,
        deadline,
        baseRate,
        subject,
        complexityLevel,
        assignmentType,
        keywords: keywordsArray,
        files, //Store file information as an array
      });
      //save object in db
      await newAssignment.save();
      res.status(200).json({
        status: "success",
        message: "Assignment uploaded successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json("Error uploading assginment");
    }
  });
};

//update assignment
const updateAssignment = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    //validate update fields
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: "error",
        message: "At least one field is required to update task",
      });
    }
    const update = await Assignment.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!update) {
      return res.status(404).json({
        status: "error",
        message: "Assignment not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Assignment updated successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "error updating assignment" });
  }
};

//deadline changes endpoint
const updateDeadline = async (req, res) => {
  const { id } = req.params;
  const { previousDeadline, updatedDeadline } = req.body;
  try {
    const updatedAssignmentDeadline = await Assignment.findByIdAndUpdate(
      id,
      {
        $push: {
          deadlineChanges: {
            previousDeadline: previousDeadline,
            updatedDeadline: updatedDeadline,
            updatedAt: Date.now(),
          },
        },
      },
      { new: true }
    );
    if (!updatedAssignmentDeadline) {
      return res.status(404).json({ error: "Assignment not found" });
    }
    res.status(200).json({
      status: "success",
      message: "Deadline changed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error updating deadline" });
  }
};

//view assignments
const viewAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find();
    if (assignments.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "no assignment found",
      });
    }
    res.status(200).json({
      status: "success",
      assignments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Error fetching assignments",
    });
  }
};

//delete assignment
const deleteAssignment = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedAssignment = await Assignment.findByIdAndDelete(id);
    // Handle task not found
    if (!deletedAssignment) {
      return res.status(404).json({
        status: "error",
        message: "Assignment not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Error deleting assignment",
    });
  }
};

module.exports = {
  uploadAssignment,
  updateAssignment,
  updateDeadline,
  viewAssignments,
  deleteAssignment,
};
