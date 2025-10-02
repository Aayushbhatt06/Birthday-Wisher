const userModel = require("../models/user");

const submit = async (req, res) => {
  try {
    const { email, DOB } = req.body;
    if (!email || !DOB) {
      return res.status(400).json({
        message: "Email and DOB are required",
        success: false,
      });
    } 

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Please verify first",
        success: false,
      });
    }

    user.dob = DOB;
    await user.save();

    return res.status(200).json({
      message: "User Added Successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update user",
      success: false,
      error: error.message,
    });
  }
};

module.exports = submit;
