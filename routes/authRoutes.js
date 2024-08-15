const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");

router.get("/login", authController.login);
router.get("/auth/callback", authController.googleOAuthHandler);
router.post("/logout", authController.logout);

module.exports = router;
