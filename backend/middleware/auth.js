const User = require('../models/user')
const jwt = require('jsonwebtoken')


// check if user is authenticated
exports.isAuthenticatedUser = async (req, res, next) => {
    
    const { token } = req.cookies

    if (!token) {
        return res.status(401).json({
            message:'Login first to access this resource'
        })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);

    next()

}