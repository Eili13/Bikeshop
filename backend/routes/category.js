const express = require('express');
const router = express.Router();

const { getCategory, createCategory, updateCategory, deleteCategory, getCategoryById } = require('../controllers/category');

router.route('/category').get(getCategory);
router.route('/category/:id').get(getCategoryById);
router.route('/category/new').post(createCategory);
router.route('/category/:id').put(updateCategory);
router.route('/category/:id').delete(deleteCategory);

module.exports = router;