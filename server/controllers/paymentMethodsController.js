const PaymentMethodsModel = require('../models/paymentMethodsModel');

exports.getAllPaymentMethods = (req, res) => {
    try {
        const paymentMethods = PaymentMethodsModel.getAllPaymentMethods();
        res.json(paymentMethods);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getPaymentMethodById = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "Payment Method ID is required" });
    }

    try {
        const paymentMethod = PaymentMethodsModel.getPaymentMethodById(id);
        res.json(paymentMethod);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

exports.createPaymentMethod = (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Payment Method name is required" });
    }

    try {
        const newId = PaymentMethodsModel.createPaymentMethod(name);
        res.status(201).json({ id: newId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deletePaymentMethod = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "Payment Method ID is required" });
    }

    try {
        const changes = PaymentMethodsModel.deletePaymentMethod(id);
        res.json({ changes });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}