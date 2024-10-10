const { userSchema, loginSchema, changePasswordSchema, updateSchema } = require("./schemas");

const validateSignUp = async (req, res, next) => {
  try {
    const value = await userSchema.validateAsync(req.body);
    next();
  } catch (error) {
    if (error.isJoi) {
      return res.json({ message: error.details[0].message });
    }
    resp.status(500).json({ message: "Internal server error" });
  }
};

const validateLogin = async (req, res, next) => {
  try {
    const value = await loginSchema.validateAsync(req.body);
    next();
  } catch (error) {
    if (error.isJoi) {
      return res.json({ message: error.details[0].message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

const validateChangePassword = async (req, res, next) => {
  try {
    const value = await changePasswordSchema.validateAsync(req.body);
    next();
  } catch (error) {
    if (error.isJoi) {
      return res.json({ message: error.details[0].message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

const validateUpdates = async (req, res, next) =>{
  try {
    const value = await updateSchema.validateAsync(req.body);
    next();
  } catch (error) {
  if (error.isJoi) {
    return res.json({ message: error.details[0].message });
  }
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = { validateSignUp, validateLogin, validateChangePassword, validateUpdates};
