const express = require("express");
const { isLoggedIn } = require("../middleware/authMiddleware");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/profile", isLoggedIn, userController.getUserProfile);
router.delete("/delete-account", isLoggedIn, userController.deleteAccount);

module.exports = router;
