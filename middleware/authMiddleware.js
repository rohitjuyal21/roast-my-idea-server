exports.isLoggedIn = (req, res, next) => {
  console.log(req.user);
  req.user ? next() : res.sendStatus(401);
};
