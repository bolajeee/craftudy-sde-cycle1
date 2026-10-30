const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  // 1. Read the authorization header
  const authHeader = req.headers.authorization;

  // 2. Check that a Bearer token was provided
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Authentication token required"
    });
  }

  // 3. Extract the token itself
  const token = authHeader.split(" ")[1];

  try {
    // 4. Verify the token's signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Make the user's identity available to later handlers
    req.user = {
      id: decoded.userId
    };

    // 6. Allow the request to continue
    return next();
  } catch (err) {
    return res.status(401).json({
      error: "Invalid or expired token"
    });
  }
}

module.exports = authenticateToken;
