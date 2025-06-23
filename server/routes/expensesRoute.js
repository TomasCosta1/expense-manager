const express = require('express');
const router = express.Router();
const ExpensesController = require('../controllers/expensesController');

// Definí rutas, por ejemplo:
router.get('/', ExpensesController.getAllExpenses);
router.get('/:id', ExpensesController.getExpenseById);
router.post('/', ExpensesController.createExpense);
router.delete('/:id', ExpensesController.deleteExpense);

module.exports = router;
