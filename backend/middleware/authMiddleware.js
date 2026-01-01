const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  // Header:
  // Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Inyect user in request
      req.user = {
        id: decoded.id,
      };

      return next();
    } catch (error) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
  }

  return res.status(401).json({
    message: "Token not found",
  });
};

module.exports = { protect };
