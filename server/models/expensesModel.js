const db = require('../db/database');

exports.getAllExpenses = () => {
    const stmt = db.prepare(`
    SELECT 
      e.id, e.name, e.amount, e.date,
      c.name AS category,
      s.name AS subcategory,
      pm.name AS payment_method
    FROM expenses e
    LEFT JOIN categories c ON e.category_id = c.id
    LEFT JOIN subcategories s ON e.subcategory_id = s.id
    LEFT JOIN payment_methods pm ON e.payment_method_id = pm.id
    ORDER BY e.date DESC
  `);
    return stmt.all();
};

exports.getExpenseById = (id) => {
    const stmt = db.prepare(`
    SELECT 
      e.id, e.name, e.amount, e.date,
      c.name AS category,
      s.name AS subcategory,
      pm.name AS payment_method
    FROM expenses e
    LEFT JOIN categories c ON e.category_id = c.id
    LEFT JOIN subcategories s ON e.subcategory_id = s.id
    LEFT JOIN payment_methods pm ON e.payment_method_id = pm.id
    WHERE e.id = ?
    `);
    const expense = stmt.get(id);
    if (!expense) {
        throw new Error(`Expense with id ${id} not found`);
    }
    return expense;
}

exports.createExpense = ({ name, amount, category_id, subcategory_id, date, payment_method_id }) => {
    const stmt = db.prepare(`
    INSERT INTO expenses (name, amount, category_id, subcategory_id, date, payment_method_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
    const result = stmt.run(name, amount, category_id, subcategory_id || null, date, payment_method_id || null);
    return result.lastInsertRowid;
};

exports.deleteExpense = (id) => {
    const stmt = db.prepare(`
    DELETE FROM expenses
    WHERE id = ?
  `);
    const result = stmt.run(id);
    if (result.changes === 0) {
        throw new Error(`Expense with id ${id} not found`);
    }
    return result.changes;
}
