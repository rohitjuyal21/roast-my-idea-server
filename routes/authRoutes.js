const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");

router.get("/google", authController.googleAuth);
router.get("/google/callback", authController.googleAuthCallback);
router.get("/google/success", authController.success);
router.get("/google/failure", authController.success);
router.post("/logout", authController.logout);

module.exports = router;
