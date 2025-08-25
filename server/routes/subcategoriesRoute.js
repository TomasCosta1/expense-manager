const express = require('express');
const router = express.Router();
const SubcategoriesController = require('../controllers/subcategoriesController');

router.get('/', SubcategoriesController.getAllSubcategories);
router.get('/category/:categoryId', SubcategoriesController.getSubcategoriesByCategory);
router.get('/:id', SubcategoriesController.getSubcategoryById);
router.post('/', SubcategoriesController.createSubcategory);
router.delete('/:id', SubcategoriesController.deleteSubcategory);

module.exports = router;