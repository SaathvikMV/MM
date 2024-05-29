const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const header = req.header("Authorization");
  // console.log(header);
  if (!header) {
    return res.status(401).json({ message: "header not provided" });
  }
  token = header.split(" ")[1];
  // console.log(token);
  if (!token) {
    return res.status(403).json({ message: "Token is not provided" });
  }
  try {
    // Verify the token
    // console.log("token verification in progroess");
    const decoded = jwt.verify(token, "your_secret_key");

    // Attach the decoded payload to the request for further use
    req.user = decoded;
    // console.log(req.user);
    next(); // Continue to the next middleware or route
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { verifyToken };
