const express = require('express');
const router = express.Router();
const PaymentMethodsController = require('../controllers/paymentMethodsController');

router.get('/', PaymentMethodsController.getAllPaymentMethods);
router.get('/:id', PaymentMethodsController.getPaymentMethodById);
router.post('/', PaymentMethodsController.createPaymentMethod);
router.delete('/:id', PaymentMethodsController.deletePaymentMethod);

module.exports = router;