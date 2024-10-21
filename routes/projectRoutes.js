const express = require("express");
const router = express.Router();

// Middleware
const authenticate = require("../middleware/authMiddleware");

// Controllers
const project = require("../controllers/projectController");

//Route level Middleware
router.use("/start-project", authenticate);

//Protected routes
router.post("/start-project", project);

module.exports = router;
