const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Adjust path to your User model

exports.isAuthenticatedUser = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ message: 'No token provided. Access denied.' });
    }

    const token = authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user; // Attach user object to req
        next();
    } catch (error) {
        console.error('JWT Middleware Error:', error);
        return res.status(401).json({ message: 'Invalid or expired token. Access denied.' });
    }
};
