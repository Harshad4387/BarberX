const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const verifyjwt = async (req, res, next) => {
  try {
    
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECERT);

    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userid).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; 
    next();
  } catch (error) {
    console.log("Error in verifyjwt middleware:", error.message);
    return res.status(401).json({ message: "Unauthorized - Token Failed" });
  }
};

module.exports = {verifyjwt};
