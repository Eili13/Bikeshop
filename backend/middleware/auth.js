// isAuthenticatedUser middleware
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.isAuthenticatedUser = async (req, res, next) => {
    let token;

    // Check if the token is passed in the Authorization header or cookies
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    // If no token, send an error
    if (!token) {
        return res.status(401).json({ message: 'Login first to access this resource' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user to the request object
        req.user = await User.findById(decoded.id);

        // If user not found, return error
        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
