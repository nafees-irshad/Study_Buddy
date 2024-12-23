const express = require("express");
const router = express.Router();

// Controllers
const {
  startProject,
  downloadAssignment,
  updatePorject,
  submitAssignment,
} = require("../controllers/projectController");

// Middleware
const authenticate = require("../middleware/authMiddleware");

//Protected routes
router.post("/start-project", authenticate, startProject);

//donwload assignmnet
router.get("/download-assignment/:id", authenticate, downloadAssignment);

//update project
router.put("/update/:id", authenticate, updatePorject);

// submit assignment
router.post("/submit-assignment", authenticate, submitAssignment);
module.exports = router;
