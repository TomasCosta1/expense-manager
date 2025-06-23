const express = require('express');
const router = express.Router();
const CategoriesController = require('../controllers/categoriesController');

router.get('/', CategoriesController.getAllCategories);
router.get('/:id', CategoriesController.getCategoryById);
router.post('/', CategoriesController.createCategory);
router.delete('/:id', CategoriesController.deleteCategory);

module.exports = router;