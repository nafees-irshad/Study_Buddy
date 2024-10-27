const express = require("express");
const router = express.Router();

// Middleware for authentication
const authenticate = require("../middleware/authMiddleware");

// tutor routes
const {
  insertTutorData,
  updateTutor,
} = require("../controllers/tutorController");

//import validator file
const validateTutor = require("../validation/tutorValidator");

//ruote level middleware
router.use("/update", authenticate);
router.use("/update", authenticate);

//protected routes
router.post("/update", validateTutor, insertTutorData);
router.put("/update", updateTutor);

module.exports = router;
