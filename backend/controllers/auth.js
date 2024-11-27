const { count } = require('console');
const User = require('../models/user');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');



// Register user => /api/v1/register
 exports.registerUser = async (req, res, next) => {
    console.log(req.body)

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
    console.log(req.body)
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
    sendToken(user, 200, res)


}

// Forgot Password => /api/v1/password/forgot
exports.forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found with this email'
        });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`

    try {
        await sendEmail({
            email: user.email,
            subject: 'BikeShop Password Recovery',
            message
        });

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

}

// Reset Password => /api/v1/password/reset/:token
exports.resetPassword = async (req, res, next) => {
    // Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return res.status(400).json({ message: 'Password reset token is invalid or has been expired' })
       
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({ message: 'Password does not match' })
      
    }

    // Setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    const token = user.getJwtToken();

     return res.status(201).json({
     	success:true,
        user,
     	token
     });
}

// Get currently logged in user details => /api/v1/me

exports.getUserProfile = async (req, res, next) => {
    try {
        // Ensure that req.user exists (it should be set by the authentication middleware)
        if (!req.user) {
            return res.status(400).json({ message: 'User not authenticated' });
        }

        // Find the user by the ID stored in req.user.id
        const user = await User.findById(req.user.id);

        // If no user is found, return a 404 error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user data in the response
        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        // Handle any unexpected errors
        console.error('Error in getUserProfile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update / Change password   => /api/v1/password/update 
exports.updatePassword = async (req, res) => {
    const user = await User.findById(req.user.id).select('+password');

    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword);
if (!isMatched) {
    return res.status(400).json({ message: 'Old password is incorrect' });
}

// Check if new password is same as old password
if (req.body.oldPassword === req.body.newPassword) {
    return res.status(400).json({ message: 'New password cannot be the same as old password' });
}

// Update new password
user.password = req.body.newPassword;
await user.save();
sendToken(user, 200, res);

    //

    res.status(200).json({
        success: true,
        message: 'Password updated successfully'
    })

}

// Update user profile => /api/v1/me/update

exports.updateProfile = async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    // Update avatar: TODO

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    })

}

// Logout user => /api/v1/logout 
exports.logout = async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
}

// Admin Routes

// Get all users => /api/v1/admin/users

exports.allUsers = async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        count: users.length,
        users
    })
}

// Get user details => /api/v1/admin/user/:id

exports.getUserDetails = async (req, res, next) => {
    const user = await User.findById(req.params.id);
    
    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'User not found'
        })
    }

    res.status(200).json({
        success: true,
        user
    })
}

// Update user profile by admin => /api/v1/admin/user/:id

exports.updateUser = async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const
    user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    
    res.status(200).json({
        success: true
    })

}

// Delete user => /api/v1/admin/user/:id

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }

        // Remove avatar from cloudinary - TODO

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
