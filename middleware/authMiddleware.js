const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");
dotenv.config();

exports.isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.sendStatus(401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.sendStatus(401);
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.sendStatus(401);
  }
};
