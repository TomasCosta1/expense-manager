const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data.sqlite');
const db = new Database(dbPath);


db.pragma('foreign_keys = ON');

// Create table: payment_methods
db.prepare(`
  CREATE TABLE IF NOT EXISTS payment_methods (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`).run();

// Create table: categories
db.prepare(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`).run();

// Create table: subcategories
db.prepare(`
  CREATE TABLE IF NOT EXISTS subcategories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  );
`).run();

// Create table: expenses
db.prepare(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    amount REAL NOT NULL,
    category_id INTEGER NOT NULL,
    subcategory_id INTEGER,
    date TEXT NOT NULL,
    payment_method_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL,
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id) ON DELETE SET NULL
  );
`).run();

// Create table: incomes
db.prepare(`
  CREATE TABLE IF NOT EXISTS incomes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    amount REAL NOT NULL,
    category_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
  );
`).run();

// Cargar categorías si no existen
const existingCategories = db.prepare('SELECT COUNT(*) as count FROM categories').get();
if (existingCategories.count === 0) {
  const insert = db.prepare('INSERT INTO categories (name) VALUES (?)');
  const categories = ['Comida', 'Transporte', 'Ocio', 'Servicios', 'Objetivo Personal', 'Otra'];
  for (const name of categories) {
    insert.run(name);
  }
  console.log('Seeded categories');
}

// Cargar métodos de pago si no existen
const existingMethods = db.prepare('SELECT COUNT(*) as count FROM payment_methods').get();
if (existingMethods.count === 0) {
  const insert = db.prepare('INSERT INTO payment_methods (name) VALUES (?)');
  const methods = ['Efectivo', 'Mercado Pago', 'Cuenta DNI', 'Tarjeta Credito', 'Tarjeta Debito', 'Otro'];
  for (const name of methods) {
    insert.run(name);
  }
  console.log('Seeded payment methods');
}

console.log('Database initialized and all tables checked.');

module.exports = db;