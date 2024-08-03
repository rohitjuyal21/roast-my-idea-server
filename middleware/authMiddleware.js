exports.isLoggedIn = (req, res, next) => {
  console.log("middleware", req.user, "above is middleware");
  req.user ? next() : res.sendStatus(401);
};
