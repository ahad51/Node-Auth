const router = require("express").Router();
const User = require("../models/User");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv =require('dotenv')

router.post("/register", async (req, res) => {
  const error = registerValidation(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).json({ error: "Email Already Exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });

  try {
    const savedUser = await user.save();
    res
      .status(200)
      .json({ message: "User registered successfully", user: savedUser });
  } catch (err) {
    res.status(400).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  const error = loginValidation(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ success:false ,error: "Email doesn't Exsist" });
  }
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    return res.status(400).json({  success:false ,error: "Invalid Password" });
  }
  const token=jwt.sign({id:user._id},process.env.TOKEN_SECRETE)
  res.header('auth-token',token).send(token);
  res.status(200).json({ success: true, message: "Login Successfully" });
});

module.exports = router;
