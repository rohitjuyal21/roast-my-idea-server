const express = require("express");
const { isLoggedIn } = require("../middleware/authMiddleware");
const { createPost, getPosts } = require("../controllers/postControllers");
const router = express.Router();

router.post("/", isLoggedIn, createPost);
router.get("/", getPosts);

module.exports = router;
