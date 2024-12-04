const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Adjust path to your User model

exports.isAuthenticatedUser = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authorization token is missing or malformed'
    });
  }

  const jwtToken = token.split(' ')[1]; // Extract token part

  try {
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET); // Verify the JWT
    const user = await User.findById(decoded.user._id); // Fetch user from DB

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user; // Attach user info to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('JWT verification failed:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};