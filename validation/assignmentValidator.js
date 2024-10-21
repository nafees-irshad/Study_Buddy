const assigmnetSchema = require("./assignmentSchema");
const validateAssignment = async (req, res, next) => {
  try {
    const value = await assigmnetSchema.validateAsync(req.body);
    next();
  } catch (error) {
    if (error.isJoi) {
      console.log(error.details);
      return res.json({ message: error.details[0].message });
    }
    console.error("Internal Server Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = validateAssignment;
