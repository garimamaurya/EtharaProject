const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    // ✅ Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Format: Bearer token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email, // optional (if included in token)
    };

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);

    return res.status(401).json({
      message: "Authentication failed",
    });
  }
};

module.exports = auth;