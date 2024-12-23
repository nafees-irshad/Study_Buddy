const express = require("express");
const router = express.Router();
//import middleware file
const authenticate = require("../middleware/authMiddleware");

//import controller file
const {
  uploadAssignment,
  updateAssignment,
  updateDeadline,
  viewAssignments,
  deleteAssignment,
} = require("../controllers/studentAssignmentController");

//import validator
// const validateAssignment = require("../validation/assignmentValidator");

//protected routes
//upload assignment
router.post("/upload", authenticate, uploadAssignment);

//update assignment
router.put("/edit/:id", authenticate, updateAssignment);

//update deadline
router.patch("/deadline/:id", authenticate, updateDeadline);

//view assignments
router.get("/", authenticate, viewAssignments);

//delete assignment
router.delete("/:id", authenticate, deleteAssignment);

module.exports = router;
