const Comment = require("../models/Comment");
const Post = require("../models/Post");

exports.postComment = async (req, res) => {
  const postId = req.params.id;
  const { comment } = req.body;
  const userId = req.user._id;

  try {
    const newComment = new Comment({
      comment,
      user: userId,
      upvotes: [],
      downvotes: [],
    });

    const savedComment = await newComment.save();
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.comments.push(savedComment._id);
    await post.save();

    res.status(201).json({ comment: savedComment, post });
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment" });
  }
};

exports.getComments = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId).populate({
      path: "comments",
      populate: { path: "user", select: "name profileImage" },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post.comments);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

exports.upvoteComment = async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user._id;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.upvotes.includes(userId)) {
      comment.upvotes.pull(userId);
    } else {
      comment.upvotes.push(userId);
      comment.downvotes.pull(userId);
    }
    await comment.save();
    const populatedComment = await comment.populate(
      "user",
      "name profileImage"
    );
    res.status(200).json(populatedComment);
  } catch (error) {
    res.status(500).json({ error: "Failed to upvote comment" });
  }
};

exports.downvoteComment = async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user._id;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.downvotes.includes(userId)) {
      comment.downvotes.pull(userId);
    } else {
      comment.downvotes.push(userId);
      comment.upvotes.pull(userId);
    }

    await comment.save();
    const populatedComment = await comment.populate(
      "user",
      "name profileImage"
    );
    res.status(200).json(populatedComment);
  } catch (error) {
    res.status(500).json({ error: "Failed to upvote comment" });
  }
};
