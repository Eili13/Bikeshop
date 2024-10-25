const express = require('express');
const router = express.Router();

const {
    getProducts,
    newProduct,
    updateProduct,
    deleteProduct,
    getSingleProduct
} = require('../controllers/product');

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// Apply authentication middleware to routes that require it
router.route('/products').get(getProducts);
router.route('/products/:id').get(getSingleProduct);
router.route('/admin/products/new').post(isAuthenticatedUser, authorizeRoles('admin'), newProduct);
router.route('/admin/products/:id').put(isAuthenticatedUser, authorizeRoles('admin'),  updateProduct);
router.route('/admin/products/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

module.exports = router;
