const jwt = require("jsonwebtoken");
const config = process.env;
User = require('../models/userModel');

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(401).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
    const {name} = req.user
    const existingUser = await User.findOne({ name });
    if (existingUser.type < 1) {
        return res.status(403).send("You don't have authorization to access");
    }
    console.log(user)
    console.log(existingUser)
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;