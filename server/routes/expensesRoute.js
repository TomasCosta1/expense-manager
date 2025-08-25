const express = require('express');
const router = express.Router();
const ExpensesController = require('../controllers/expensesController');

router.get('/', ExpensesController.getAllExpenses);
router.get('/paginated', ExpensesController.getExpensesPaginated);
router.get('/amounts', ExpensesController.getAllAmountExpenses);
router.get('/by-category', ExpensesController.getExpensesByCategory);
router.post('/bulk', ExpensesController.createExpensesBulk);
router.get('/:id', ExpensesController.getExpenseById);
router.post('/', ExpensesController.createExpense);
router.put('/:id', ExpensesController.updateExpense);
router.delete('/:id', ExpensesController.deleteExpense);

module.exports = router;
