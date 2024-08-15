const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("userfetched error", error.message);
  }
};

exports.deleteAccount = async (req, res) => {
  const userId = req.user._id;

  const userComments = await Comment.find({ user: userId });

  const userCommentIds = userComments.map((comment) => comment._id);

  try {
    await Post.updateMany(
      {},
      {
        $pull: {
          upvotes: userId,
          downvotes: userId,
          saves: userId,
          comments: { $in: userCommentIds },
        },
      }
    );
    await Comment.updateMany(
      {},
      { $pull: { upvotes: userId, downvotes: userId } }
    );
    await Comment.deleteMany({ user: userId });
    await Post.deleteMany({ createdBy: userId });
    await User.findByIdAndDelete(userId);

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "Development" ? false : true,
    });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete account" });
  }
};
