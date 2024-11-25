const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware to check if the user is authenticated
exports.isAuthenticatedUser = async (req, res, next) => {
    // Extract token from Authorization header (Bearer <token>)
    const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer ') 
        ? req.headers.authorization.split(' ')[1] 
        : null;

    // Check if the token is missing
    if (!token) {
        return res.status(401).json({
            message: 'Login first to access this resource'
        });
    }

    try {
        // Verify token with JWT secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Log decoded token for debugging purposes
        console.log('Decoded token:', decoded);

        // Attach the user to the request object based on the token payload
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                message: 'User not found or token is invalid'
            });
        }

        req.user = user;  // Attach user to req.user

        // Log the user object for debugging purposes
        console.log('Authenticated user:', req.user);

        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        // If JWT verification fails, return an error
        console.error('JWT verification failed:', error); // Log the error for debugging
        return res.status(401).json({
            message: 'Invalid token or token expired',
            error: error.message  // Return the error message for debugging
        });
    }
};

// Middleware to check if user has the required role(s)
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // Check if the user's role is allowed to access the resource
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Role (${req.user.role}) is not allowed to access this resource`
            });
        }
        next();  // Proceed to the next middleware or route handler
    };
};
