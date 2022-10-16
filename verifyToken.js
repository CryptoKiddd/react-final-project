const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authToken= req.headers.token;
  if (authToken) {
    const token = authToken.split(" ")[1]
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {res.status(403).json("token is not valid")};
        req.user = user;
        next();
      
    });
  } else {
    return res.status(401).json("you are not authenthicated");
  }
};

const verifyTokenAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("not allowed");
    }
  });
};
const verifyTokenAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("not allowed");
    }
  });
};

module.exports = { verifyToken,verifyTokenAuthorization,verifyTokenAdmin };
