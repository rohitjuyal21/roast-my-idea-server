const passport = require("passport");
const dotenv = require("dotenv");
dotenv.config();

console.log(`Environment: ${process.env.NODE_ENV}`);
console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
console.log(`Backend URL: ${process.env.BACKEND_URL}`);

exports.googleAuth = passport.authenticate("google", {
  scope: ["email", "profile"],
});

exports.googleAuthCallback = passport.authenticate("google", {
  successRedirect: "/auth/google/success",
  failureRedirect: "/auth/google/failure",
});

exports.success = (req, res) => {
  console.log("login successful");
  res.redirect(`${process.env.FRONTEND_URL}`);
};

exports.failure = (req, res) => {
  console.log("login failure occured");
  res.redirect(`${process.env.FRONTEND_URL}/login`);
};

exports.logout = (req, res) => {
  res.clearCookie("roastmyidea");
  req.logout((err) => {
    req.session.destroy((err) => {
      res.send();
    });
  });
};
