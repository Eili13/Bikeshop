// At the top of your auth.js file, add the following line if it's not already there:
const crypto = require('crypto');

// Ensure the rest of your code remains unchanged
const express = require('express');
const router = express.Router();



const { registerUser, 
    loginUser, logout, 
    forgotPassword, 
    resetPassword, 
    getUserProfile, 
    updatePassword, 
    updateProfile, 
    allUsers, 
    getUserDetails, 
    updateUser,
    deleteUser } = require('../controllers/auth');

const { isAuthenticatedUser, authorizeRoles  } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/logout').get(logout);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/me').get(getUserProfile);
router.route('/password/update').put( updatePassword);
router.route('/me/update').put( updateProfile);
router.route('/users').get( allUsers);
router.route('/user/:id').get( getUserDetails);
router.route('/user/:id').put(updateUser);
router.route('/user/:id').delete(deleteUser);

module.exports = router;