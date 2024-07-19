const express = require("express");
const { isLoggedIn } = require("../middleware/authMiddleware");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/profile", isLoggedIn, userController.getUserProfile);

module.exports = router;
