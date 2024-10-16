const express = require("express");
const router = express.Router();
//import middleware file
const authenticate = require("../middleware/authMiddleware");

//import assignment file
const assignment = require("../controllers/assignmentController");

//Route level Middleware
router.use("/upload", authenticate);

//protected routes
router.post("/upload", assignment);

module.exports = router;
