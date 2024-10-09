const express = require("express");
const router = express.Router();
const checkUserAuth = require("../middleware/authMiddleware");
//user routes
const {
  registerUser,
  loginUser,
  changePassword,
} = require("../controllers/userController");

//Route level Middleware
router.use("/change-password", checkUserAuth);

//validators
const {
  validateSignUp,
  validateLogin,
  validateChangePassword,
} = require("../validation/validater");

//public routes
router.post("/register", validateSignUp, registerUser);
router.post("/login", validateLogin, loginUser);

//protected routes
router.post("/change-password", validateChangePassword, changePassword);
module.exports = router;
