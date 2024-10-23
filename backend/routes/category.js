const express = require('express');
const router = express.Router();


const {getAllCategories,createCategory,updateCategory,deleteCategory} = require('../controllers/category')




router.route('/category').get(getAllCategories);
router.route('/category/new').post(createCategory);
router.route('/category/:id').put(updateCategory);
router.route('/category/:id').delete(deleteCategory);

// router.post('/', createCategory);
// router.put('/:id', updateCategory)
// router.delete("/:id", deleteCategory)

module.exports = router;
