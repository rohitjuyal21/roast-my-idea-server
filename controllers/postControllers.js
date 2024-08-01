const User = require("../models/User");
const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  try {
    const { category, idea } = req.body;
    const newPost = new Post({
      category,
      idea,
      createdBy: req.user._id,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};

exports.upvotePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.upvotes.includes(userId)) {
      post.upvotes.pull(userId);
    } else {
      post.upvotes.push(userId);
      post.downvotes.pull(userId);
    }
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error upvoting post" });
  }
};

exports.downvotePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.downvotes.includes(userId)) {
      post.downvotes.pull(userId);
    } else {
      post.downvotes.push(userId);
      post.upvotes.pull(userId);
    }
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error downvoting post" });
  }
};

exports.savePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isSaved = post.saves.includes(userId);

    if (isSaved) {
      post.saves.pull(userId);
    } else {
      post.saves.push(userId);
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSavedPosts = async (req, res) => {
  const userId = req.user._id;
  try {
    const posts = await Post.find({ saves: userId });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not foud" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post" });
  }
};
