const passport = require("passport");

exports.googleAuth = passport.authenticate("google", {
  scope: ["email", "profile"],
});

exports.googleAuthCallback = passport.authenticate("google", {
  successRedirect: "/auth/google/success",
  failureRedirect: "/auth/google/failure",
});

exports.success = (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}`);
};

exports.failure = (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/login`);
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send("hello");
  });
};
