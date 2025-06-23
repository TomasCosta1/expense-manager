const express = require('express');
const app = express();
const db = require('./db/database');
const expensesRoutes = require('./routes/expensesRoute');
const categoriesRoutes = require('./routes/categoriesRoute');
const subcategoriesRoutes = require('./routes/subcategoriesRoute');
const paymentMethodsRoutes = require('./routes/paymentMethodsRoute');
const incomesRoutes = require('./routes/incomesRoute');

app.use(express.json());

// Rutas
app.use('/api/expenses', expensesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/subcategories', subcategoriesRoutes);
app.use('/api/payment-methods', paymentMethodsRoutes);
app.use('/api/incomes', incomesRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});