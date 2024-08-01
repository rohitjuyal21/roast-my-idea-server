const express = require("express");
const { isLoggedIn } = require("../middleware/authMiddleware");
const {
  createPost,
  getPosts,
  upvotePost,
  downvotePost,
  savePost,
  getSavedPosts,
  getPostById,
} = require("../controllers/postControllers");
const router = express.Router();

router.post("/", isLoggedIn, createPost);
router.get("/", getPosts);
router.post("/:id/upvote", isLoggedIn, upvotePost);
router.post("/:id/downvote", isLoggedIn, downvotePost);
router.post("/:id/save", isLoggedIn, savePost);
router.get("/saved", isLoggedIn, getSavedPosts);
router.get("/:id", isLoggedIn, getPostById);

module.exports = router;
