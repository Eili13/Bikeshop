const express = require('express');
const router = express.Router();

const { getAllCategories, createCategory, updateCategory, deleteCategory, getCategoryById } = require('../controllers/category');

router.route('/category').get(getAllCategories);
router.route('/category/:id').get(getCategoryById);
router.route('/category/new').post(createCategory);
router.route('/category/:id').put(updateCategory);
router.route('/category/:id').delete(deleteCategory);

module.exports = router;