const express = require('express');
const router = express.Router();




const {getProducts,newProduct,updateProduct,deleteProduct} = require('../controllers/product')


router.route('/products').get(getProducts);
router.route('/products/new').post(newProduct);
router.route('/products/:id').put(updateProduct);
router.route('/products/:id').delete(deleteProduct);



module.exports = router;