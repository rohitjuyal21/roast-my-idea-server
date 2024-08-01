const express = require("express");
const { isLoggedIn } = require("../middleware/authMiddleware");
const {
  postComment,
  getComments,
  upvoteComment,
  downvoteComment,
} = require("../controllers/commentController");
const router = express.Router();

router.post("/:id", isLoggedIn, postComment);
router.get("/:id", isLoggedIn, getComments);
router.post("/:id/upvote", isLoggedIn, upvoteComment);
router.post("/:id/downvote", isLoggedIn, downvoteComment);

module.exports = router;
