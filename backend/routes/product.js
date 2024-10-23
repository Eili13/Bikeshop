const express = require('express');
const router = express.Router();




const {getProducts,newProduct,updateProduct,deleteProduct,getSingleProduct} = require('../controllers/product')


router.route('/products').get(getProducts);
router.route('/admin/products/:id').get(getSingleProduct);
router.route('/admin/products/new').post(newProduct);
router.route('/admin/products/:id').put(updateProduct);
router.route('/admin/products/:id').delete(deleteProduct);



module.exports = router;