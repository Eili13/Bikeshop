const User = require('../models/user');
const sendToken = require('../utils/jwtToken');



// Register user => /api/v1/register
 exports.registerUser = async (req, res, next) => {

    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: 'Avatar/txjp9yb3quobztsc4hc4',
            url: 'https://res.cloudinary.com/dofbmu0m5/image/upload/v1729756986/Avatar/txjp9yb3quobztsc4hc4.jpg'
        }
    })

    sendToken(user, 200, res)
 }


 // Login user => /api/v1/login 
exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password is entered by user
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please enter email & password'
        });
    }

    // Finding user in database
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid Email or Password'
        });
    }

    // Check if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return res.status(401).json({
            success: false,
            message: 'Invalid Email or Password'
        });
    }
    // sendToken(user, 200, res)


}
