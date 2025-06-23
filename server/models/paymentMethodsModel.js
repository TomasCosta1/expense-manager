const db = require('../db/database');

exports.getAllPaymentMethods = () => {
    const stmt = db.prepare(`
        SELECT id, name
        FROM payment_methods
        ORDER BY name ASC
    `);
    return stmt.all();
}

exports.getPaymentMethodById = (id) => {
    const stmt = db.prepare(`
        SELECT id, name
        FROM payment_methods
        WHERE id = ?
    `);
    const paymentMethod = stmt.get(id);
    if (!paymentMethod) {
        throw new Error(`Payment method with id ${id} not found`);
    }
    return paymentMethod;
}

exports.createPaymentMethod = (name) => {
    const stmt = db.prepare(`
        INSERT INTO payment_methods (name)
        VALUES (?)
    `);
    const result = stmt.run(name);
    return result.lastInsertRowid;
}

exports.deletePaymentMethod = (id) => {
    const stmt = db.prepare(`
        DELETE FROM payment_methods
        WHERE id = ?
    `);
    const result = stmt.run(id);
    if (result.changes === 0) {
        throw new Error(`Payment method with id ${id} not found`);
    }
    return result.changes;
}