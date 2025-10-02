const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const otpModel = require("../models/otp");

const verifyOtp = async (req, res) => {
  try {
    const { email, otp, name } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      const record = await otpModel.findOne({ email });
      if (!record) {
        return res.status(400).json({
          message: "No OTP found for this email",
          success: false,
        });
      }
      if (record.expiresAt < new Date()) {
        return res.status(400).json({
          message: "OTP expired",
          success: false,
        });
      }

      const isMatch = await bcrypt.compare(otp.toString(), record.otp);
      if (!isMatch) {
        return res.status(400).json({
          message: "Invalid OTP",
          success: false,
        });
      }
      await otpModel.deleteOne({ email });

      return res.status(200).json({
        message: "Verified Successfully",
        success: true,
      });
    }

    const record = await otpModel.findOne({ email });
    if (!record) {
      return res.status(400).json({
        message: "No OTP found for this email",
        success: false,
      });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({
        message: "OTP expired",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(otp.toString(), record.otp);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid OTP",
        success: false,
      });
    }

    const newUser = new userModel({
      name,
      email,
    });
    await newUser.save();

    await otpModel.deleteOne({ email });

    return res.status(200).json({
      message: "Verified Successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Verification failed",
      success: false,
      error: error.message,
    });
  }
};

module.exports = verifyOtp;
