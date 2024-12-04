const express = require('express');
const router = express.Router();

const {
    getProducts,
    newProduct,
    updateProduct,
    deleteProduct,
    getSingleProduct,
    addReview,
    updateReview,
    deleteReview
} = require('../controllers/product');

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// Apply authentication middleware to routes that require it
router.post('/product/', newProduct)
router.get('/products', getProducts)
router.get('/productss/:id', getSingleProduct)
router.put('/products/:id', updateProduct)
router.delete('/productsss/:id', deleteProduct)
router.post('/products/review' , addReview);
router.delete('/products/review', deleteReview);
router.put('/products/:productId/reviews/:reviewId', updateReview);


module.exports = router;
    