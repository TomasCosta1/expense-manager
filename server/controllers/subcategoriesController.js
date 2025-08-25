const SubcategoryModel = require('../models/subcategoriesModel');

exports.getAllSubcategories = (req, res) => {
    try {
        const subcategories = SubcategoryModel.getAllSubcategories();
        res.json(subcategories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getSubcategoryById = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "Subcategory ID is required" });
    }

    try {
        const subcategory = SubcategoryModel.getSubcategoryById(id);
        res.json(subcategory);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

exports.getSubcategoriesByCategory = (req, res) => {
    const { categoryId } = req.params;

    if (!categoryId) {
        return res.status(400).json({ error: "Category ID is required" });
    }

    try {
        const subcategories = SubcategoryModel.getSubcategoriesByCategory(categoryId);
        res.json(subcategories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.createSubcategory = (req, res) => {
    const { name, category_id } = req.body;

    if (!name || !category_id) {
        return res.status(400).json({ error: "Required fields: name, category_id" });
    }

    try {
        const newId = SubcategoryModel.createSubcategory(name, category_id);
        res.status(201).json({ id: newId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteSubcategory = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "Subcategory ID is required" });
    }

    try {
        const changes = SubcategoryModel.deleteSubcategory(id);
        res.json({ changes });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}