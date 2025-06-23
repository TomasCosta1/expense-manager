const db = require('../db/database');

exports.getAllIncomes = () => {
    const stmt = db.prepare(`
        SELECT id, name, amount, date
        FROM incomes
        ORDER BY date DESC
    `);
    return stmt.all();
}

exports.getIncomeById = (id) => {
    const stmt = db.prepare(`
        SELECT id, name, amount, date
        FROM incomes
        WHERE id = ?
    `);
    const income = stmt.get(id);
    if (!income) {
        throw new Error(`Income with id ${id} not found`);
    }
    return income;
}

exports.createIncome = ({ name, amount, date }) => {
    const stmt = db.prepare(`
        INSERT INTO incomes (name, amount, date)
        VALUES (?, ?, ?)
    `);
    const result = stmt.run(name, amount, date);
    return result.lastInsertRowid;
}

exports.deleteIncome = (id) => {
    const stmt = db.prepare(`
        DELETE FROM incomes
        WHERE id = ?
    `);
    const result = stmt.run(id);
    if (result.changes === 0) {
        throw new Error(`Income with id ${id} not found`);
    }
    return result.changes;
}