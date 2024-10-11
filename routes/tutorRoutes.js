const express = require("express");
const router = express.Router();

// Middleware for authentication
const authenticate = require("../middleware/authMiddleware");
router.use("/update", authenticate);

// tutor routes
const tutorData = require("../controllers/tutorController");

//protected routes
router.post("/update", tutorData);

module.exports = router;
