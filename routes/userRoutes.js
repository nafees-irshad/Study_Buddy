const express = require("express");
const router = express.Router();
const checkUserAuth = require("../middleware/authMiddleware");
//user routes
const {
  registerUser,
  loginUser,
  changePassword,
  updateUser
} = require("../controllers/userController");

//Route level Middleware
router.use("/change-password", checkUserAuth);
router.use("/update", checkUserAuth);

//validators
const {
  validateSignUp,
  validateLogin,
  validateChangePassword,
  validateUpdates,
} = require("../validation/validater");

//public routes
router.post("/register", validateSignUp, registerUser);
router.post("/login", validateLogin, loginUser);

//protected routes
router.post("/change-password", validateChangePassword, changePassword);
router.put('/update',validateUpdates, updateUser)
module.exports = router;
