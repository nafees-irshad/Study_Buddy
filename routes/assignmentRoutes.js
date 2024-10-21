const express = require("express");
const router = express.Router();
//import middleware file
const authenticate = require("../middleware/authMiddleware");

//import controller file
const uploadAssignment = require("../controllers/assignmentController");

//Route level Middleware
router.use("/upload", authenticate);

//import validator
const validateAssignment = require("../validation/assignmentValidator");

//protected routes
router.post("/upload", validateAssignment, uploadAssignment);
module.exports = router;
