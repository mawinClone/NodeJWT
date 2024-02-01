//middleware for authentication

const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("no token");
  }

  try {
    const decode = jwt.verify(token, config.TOKEN_KEY);
    req.user = decode;
  } catch {
    return res.status(401).send("invalid token");
  }

  return next();
};

module.exports = verifyToken;
