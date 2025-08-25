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
    date TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`).run();

// Cargar categorías si no existen
const existingCategories = db.prepare('SELECT COUNT(*) as count FROM categories').get();
if (existingCategories.count === 0) {
  const insert = db.prepare('INSERT INTO categories (name) VALUES (?)');
  const categories = ['Alimentación', 'Transporte', 'Entretenimiento', 'Viajes', 'Salud', 'Educación', 'Hogar', 'Objetivo Personal', 'Otra'];
  for (const name of categories) {
    insert.run(name);
  }
  console.log('Seeded categories');
}

const subcategories = [
  { name: 'Supermercado', category_id: 1 },
  { name: 'Restaurante', category_id: 1 },
  { name: 'Delivery', category_id: 1 },
  { name: 'Comida Rápida', category_id: 1 },
  { name: 'Peaje', category_id: 2 },
  { name: 'Combustible', category_id: 2 },
  { name: 'Taxi/Remis', category_id: 2 },
  { name: 'Bicicleta', category_id: 2 },
  { name: 'Cine', category_id: 3 },
  { name: 'Teatro', category_id: 3 },
  { name: 'Concierto', category_id: 3 },
  { name: 'Museo', category_id: 3 },
  { name: 'Hotel', category_id: 4 },
  { name: 'Pasajes', category_id: 4 },
  { name: 'Excursiones', category_id: 4 },
  { name: 'Alquiler de Vehículo', category_id: 4 },
  { name: 'Medicamentos', category_id: 5 },
  { name: 'Consulta Médica', category_id: 5 },
  { name: 'Seguro de Salud', category_id: 5 },
  { name: 'Gimnasio', category_id: 5 },
  { name: 'Libros', category_id: 6 },
  { name: 'Cursos Online', category_id: 6 },
  { name: 'Clases Presenciales', category_id: 6 },
  { name: 'Material Educativo', category_id: 6 },
  { name: 'Alquiler', category_id: 7 },
  { name: 'Servicios Públicos', category_id: 7 },
  { name: 'Mantenimiento del Hogar', category_id: 7 },
  { name: 'Muebles y Decoración', category_id: 7 },
  { name: 'Ahorro', category_id: 8 },
  { name: 'Inversión', category_id: 8 },
  { name: 'Donaciones', category_id: 8 },
  { name: 'Objetivos Personales', category_id: 8 },
  { name: 'Otros', category_id: 9 }
];

subcategories.forEach(({ name, category_id }) => {
  const exists = db.prepare(`SELECT 1 FROM subcategories WHERE name = ? AND category_id = ?`).get(name, category_id);
  if (!exists) {
    db.prepare(`INSERT INTO subcategories (name, category_id) VALUES (?, ?)`).run(name, category_id);
  }
});

// Cargar métodos de pago si no existen
const existingMethods = db.prepare('SELECT COUNT(*) as count FROM payment_methods').get();
if (existingMethods.count === 0) {
  const insert = db.prepare('INSERT INTO payment_methods (name) VALUES (?)');
  const methods = ['Efectivo', 'Tarjeta de Crédito', 'Tarjeta de Débito', 'Transferencia Bancaria', 'Mercado Pago', 'Cuenta DNI', 'Otro'];
  for (const name of methods) {
    insert.run(name);
  }
  console.log('Seeded payment methods');
}

console.log('Database initialized and all tables checked.');

module.exports = db;