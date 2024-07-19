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
