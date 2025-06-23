const CategoryModel = require('../models/categoriesModel');

exports.getAllCategories = (req, res) => {
    try {
        const categories = CategoryModel.getAllCategories();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getCategoryById = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "Category ID is required" });
    }

    try {
        const category = CategoryModel.getCategoryById(id);
        res.json(category);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

exports.createCategory = (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Category name is required" });
    }

    try {
        const newId = CategoryModel.createCategory(name);
        res.status(201).json({ id: newId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteCategory = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "Category ID is required" });
    }

    try {
        const changes = CategoryModel.deleteCategory(id);
        res.json({ changes });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}