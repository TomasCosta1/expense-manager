const db = require('../db/database');

exports.getAllCategories = () => {
    const stmt = db.prepare(`
        SELECT c.id, c.name, COUNT(e.id) AS expense_count
        FROM categories c
        LEFT JOIN expenses e ON c.id = e.category_id
        GROUP BY c.id
        ORDER BY c.name ASC
    `);
    return stmt.all();
}

exports.getCategoryById = (id) => {
    const stmt = db.prepare(`
        SELECT c.id, c.name, COUNT(e.id) AS expense_count
        FROM categories c
        LEFT JOIN expenses e ON c.id = e.category_id
        WHERE c.id = ?
        GROUP BY c.id
    `);
    const category = stmt.get(id);
    if (!category) {
        throw new Error(`Category with id ${id} not found`);
    }
    return category;
}

exports.createCategory = (name) => {
    const stmt = db.prepare(`
        INSERT INTO categories (name)
        VALUES (?)
    `);
    const result = stmt.run(name);
    return result.lastInsertRowid;
}

exports.deleteCategory = (id) => {
    const stmt = db.prepare(`
        DELETE FROM categories
        WHERE id = ?
    `);
    const result = stmt.run(id);
    if (result.changes === 0) {
        throw new Error(`Category with id ${id} not found`);
    }
    return result.changes;
}