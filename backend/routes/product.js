const express = require('express');
const router = express.Router();

const {
    getProducts,
    newProduct,
    updateProduct,
    deleteProduct,
    getSingleProduct
} = require('../controllers/product');

const { isAuthenticatedUser } = require('../middleware/auth');

// Apply authentication middleware to routes that require it
router.route('/products').get(isAuthenticatedUser, getProducts);
router.route('/admin/products/:id').get(getSingleProduct);
router.route('/admin/products/new').post(newProduct);
router.route('/admin/products/:id').put(updateProduct);
router.route('/admin/products/:id').delete(deleteProduct);

module.exports = router;
