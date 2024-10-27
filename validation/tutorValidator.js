const tutorSchema = require("./tutorSchema");

const validateTutor = async (req, res, next) => {
  try {
    const value = await tutorSchema.validateAsync(req.body);
    next();
  } catch (error) {
    if (error.isJoi) {
      console.log(error.details);
      return res.status(400).json({ message: error.details[0].message });
    }
    console.log("Internal Server Error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = validateTutor;
