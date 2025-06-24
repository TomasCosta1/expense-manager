const express = require('express');
const router = express.Router();
const IncomesController = require('../controllers/incomesController');

router.get('/', IncomesController.getAllIncomes);
router.get('/amounts', IncomesController.getAllAmountIncomes)
router.get('/:id', IncomesController.getIncomeById);
router.post('/', IncomesController.createIncome);
router.delete('/:id', IncomesController.deleteIncome);

module.exports = router;