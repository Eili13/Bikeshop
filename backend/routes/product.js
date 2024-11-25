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
router.post('/product/', newProduct)
router.get('/products', getProducts)
router.get('/products/:id', getSingleProduct)
router.put('/admin/products/:id', updateProduct)
router.delete('/admin/products/:id', deleteProduct)

module.exports = router;
    