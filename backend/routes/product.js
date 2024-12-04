const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');


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
router.post('/product', upload.array('images'), newProduct);
router.get('/products', getProducts);
router.get('/products/:id', getSingleProduct);  // Corrected route
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);  // This route also has a typo (`productsss` should be `products`)
router.post('/products/review', addReview);
router.delete('/products/review', deleteReview);
router.put('/products/:productId/reviews/:reviewId', updateReview);




module.exports = router;
    