const express = require("express");
const flash = require("connect-flash");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const Expenses = require("../models/expense.js");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middlewears/jwt_verify.js");
const bcrypt = require("bcrypt");

router.get("/register", cors(), function (req, res) {});

router.post("/register", async (req, res) => {
  try {
    const { email, username, password, confirm_password } = req.body;

    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({ error: "Username is already taken" });
    }

    // Check if the email is already registered
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.json({ error: "Email is already registered" });
    }

    if (password !== confirm_password){
      return res.json({ error: "Both password should be same" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email: email,
      username,
      password: hashedPassword,
    });
    const registeredUser = await user.save();
    // console.log(registeredUser);
    // Generate JWT token
    const token = jwt.sign({ id: registeredUser._id }, "your_secret_key", {
      expiresIn: "1h",
    });

    const expense = new Expenses({
      user: registeredUser._id,
      expense: [],
    });
    await expense.save();


    res.json({
      redirectUrl: `/${registeredUser.username}/dashboard`,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/register");
  }
});

router.get("/login", cors(), async (req, res) => {});

// User login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ error: "Invalid Email" });
    }

    // Ensure that user.password contains the hashed password from the database
    if (!user.password) {
      return res.json({ error: "Invalid Password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.json({ error: "Invalid Password" });
    }

    // If authentication is successful, generate a JWT token
    const token = jwt.sign({ id: user._id }, "your_secret_key", {
      expiresIn: "1h",
    });

    res.json({ token: token, redirectUrl: `/${user.username}/dashboard` });
  } catch (error) {
    console.error(error);
    res.json({ error: "An error occurred during login" });
  }
});

router.get("/logout", cors(), function (req, res) {
  res.json({ message: "Logout successful" });
});

module.exports = router;
