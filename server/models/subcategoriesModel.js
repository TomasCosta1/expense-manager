const db = require('../db/database');

exports.getAllSubcategories = () => {
    const stmt = db.prepare(`
        SELECT s.id, s.name, c.name AS category
        FROM subcategories s
        LEFT JOIN categories c ON s.category_id = c.id
        ORDER BY s.name ASC
    `);
    return stmt.all();
}

exports.getSubcategoryById = (id) => {
    const stmt = db.prepare(`
        SELECT s.id, s.name, c.name AS category
        FROM subcategories s
        LEFT JOIN categories c ON s.category_id = c.id
        WHERE s.id = ?
    `);
    const subcategory = stmt.get(id);
    if (!subcategory) {
        throw new Error(`Subcategory with id ${id} not found`);
    }
    return subcategory;
}

exports.createSubcategory = (name, category_id) => {
    const stmt = db.prepare(`
        INSERT INTO subcategories (name, category_id)
        VALUES (?, ?)
    `);
    const result = stmt.run(name, category_id);
    return result.lastInsertRowid;
}

exports.deleteSubcategory = (id) => {
    const stmt = db.prepare(`
        DELETE FROM subcategories
        WHERE id = ?
    `);
    const result = stmt.run(id);
    if (result.changes === 0) {
        throw new Error(`Subcategory with id ${id} not found`);
    }
    return result.changes;
}