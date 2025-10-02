const sendEmail = require("../utils/sendGrid");
const bcrypt = require("bcrypt");
const otpModel = require("../models/otp");

const sendOtp = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res
        .status(400)
        .json({ message: "Name and email required", success: false });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const data = {
      to: email,
      subject: "Email Verification",
      text: `Hello ${name}, your OTP is ${otp}`,
    };

    await sendEmail(data);

    const hashedOtp = await bcrypt.hash(otp.toString(), 11);
    await otpModel.findOneAndUpdate(
      { email },
      { otp: hashedOtp, expiresAt: Date.now() + 5 * 60 * 1000 },
      { upsert: true, new: true }
    );

    return res
      .status(200)
      .json({ message: "OTP sent successfully", success: true });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to send OTP",
      success: false,
      error: err.message,
    });
  }
};

module.exports = sendOtp;
