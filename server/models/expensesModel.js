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
    ORDER BY e.date DESC, e.id DESC
  `);
    return stmt.all();
};

exports.getExpensesPaginated = (page = 0, limit = 10, filters = {}, sort = {}) => {
    const offset = page * limit;
    
    // Build WHERE clause
    let whereConditions = [];
    let params = [];
    
    if (filters.category_id) {
        whereConditions.push('e.category_id = ?');
        params.push(filters.category_id);
    }
    
    if (filters.subcategory_id) {
        whereConditions.push('e.subcategory_id = ?');
        params.push(filters.subcategory_id);
    }
    
    if (filters.payment_method_id) {
        whereConditions.push('e.payment_method_id = ?');
        params.push(filters.payment_method_id);
    }
    
    // Add month filter
    if (filters.month && filters.year) {
        whereConditions.push("strftime('%Y', e.date) = ? AND strftime('%m', e.date) = ?");
        params.push(filters.year.toString(), filters.month.toString().padStart(2, '0'));
    }
    
    // Build ORDER BY clause
    let orderBy = 'ORDER BY ';
    if (sort.field === 'amount') {
        orderBy += `e.amount ${sort.direction || 'DESC'}`;
    } else if (sort.field === 'date') {
        orderBy += `e.date ${sort.direction || 'DESC'}`;
    } else {
        orderBy += 'e.date DESC, e.id DESC';
    }
    
    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';
    
    const query = `
    SELECT 
      e.id, e.name, e.amount, e.date,
      c.name AS category,
      s.name AS subcategory,
      pm.name AS payment_method,
      e.category_id,
      e.subcategory_id,
      e.payment_method_id
    FROM expenses e
    LEFT JOIN categories c ON e.category_id = c.id
    LEFT JOIN subcategories s ON e.subcategory_id = s.id
    LEFT JOIN payment_methods pm ON e.payment_method_id = pm.id
    ${whereClause}
    ${orderBy}
    LIMIT ? OFFSET ?
  `;
    
    params.push(limit, offset);
    const stmt = db.prepare(query);
    
    return stmt.all(...params);
};

exports.getTotalExpensesCount = (filters = {}) => {
    // Build WHERE clause
    let whereConditions = [];
    let params = [];
    
    if (filters.category_id) {
        whereConditions.push('category_id = ?');
        params.push(filters.category_id);
    }
    
    if (filters.subcategory_id) {
        whereConditions.push('subcategory_id = ?');
        params.push(filters.subcategory_id);
    }
    
    if (filters.payment_method_id) {
        whereConditions.push('payment_method_id = ?');
        params.push(filters.payment_method_id);
    }
    
    // Add month filter
    if (filters.month && filters.year) {
        whereConditions.push("strftime('%Y', date) = ? AND strftime('%m', date) = ?");
        params.push(filters.year.toString(), filters.month.toString().padStart(2, '0'));
    }
    
    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';
    
    const query = `SELECT COUNT(*) as total FROM expenses ${whereClause}`;
    const stmt = db.prepare(query);
    
    return stmt.get(...params).total;
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

exports.getExpensesByCategory = () => {
    const stmt = db.prepare(`
    SELECT 
      c.name AS category,
      SUM(e.amount) AS total_amount,
      COUNT(e.id) AS expense_count
    FROM expenses e
    LEFT JOIN categories c ON e.category_id = c.id
    WHERE e.date >= date('now', '-30 days')
    GROUP BY c.id, c.name
    ORDER BY total_amount DESC
  `);
    return stmt.all();
};

exports.updateExpense = (id, { name, amount, category_id, subcategory_id, date, payment_method_id }) => {
    const stmt = db.prepare(`
        UPDATE expenses 
        SET name = ?, amount = ?, category_id = ?, subcategory_id = ?, 
            date = ?, payment_method_id = ?
        WHERE id = ?
    `);
    const result = stmt.run(name, amount, category_id, subcategory_id || null, date, payment_method_id || null, id);
    if (result.changes === 0) {
        throw new Error(`Expense with id ${id} not found`);
    }
    return result.changes;
};
