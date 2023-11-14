const router = require("express").Router();
const User = require("../models/User");
const { resetPassValidation } = require("../validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

// Password reset request route
router.post("/forget", async (req, res) => {
  // Validate the email provided in the request
  const error = resetPassValidation(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const email = req.body.email;

  // Check if the email exists in the database
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ success: false, error: "Email doesn't exist" });
  }

  // Generate a reset token and set an expiration time (e.g., 1 hour)
  const resetToken = jwt.sign({ id: user._id }, process.env.RESET_SECRET, {
    expiresIn: "1h",
  });

  // Send the reset email with the token
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "4c249a48fefb05",
      pass: "acb1e0553f142c",
    },
  });

  const mailOptions = {
    from: "abdul.ahad@zweidevs.com",
    to: user.email,
    subject: "Password Reset Request",
    html: `<p>Click this link to reset your password: <a href="http://your-frontend-url/reset/${resetToken}">Reset Password</a></p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    console.log(error);
    if (error) {
      return res
        .status(500)
        .json({ success: false, error: "Email could not be sent" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Password reset link sent" });
  });
});

// Password reset route
router.post("/reset/:token", async (req, res) => {
  // Validate the new password provided in the request
  const error = resetPassValidation(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const token = req.params.token;

  // Verify the token to ensure it's valid and hasn't expired
  jwt.verify(token, process.env.RESET_SECRET, async (err, decoded) => {
    if (err) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid or expired token" });
    }

    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return res.status(400).json({ success: false, error: "User not found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // Update the user's password with the new hashed password
    user.password = hashPassword;

    // Save the updated user object
    try {
      await user.save();
      return res
        .status(200)
        .json({ success: true, message: "Password reset successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, error: "Error updating password" });
    }
  });
});

module.exports = router;
