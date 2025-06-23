const IncomesModel = require('../models/incomesModel');

exports.getAllIncomes = (req, res) => {
    try {
        const incomes = IncomesModel.getAllIncomes();
        res.json(incomes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getIncomeById = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "Income ID is required" });
    }

    try {
        const income = IncomesModel.getIncomeById(id);
        res.json(income);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

exports.createIncome = (req, res) => {
    const {
        name,
        amount,
        category_id,
        subcategory_id,
        date,
        payment_method_id,
    } = req.body;

    if (!amount || !category_id || !date) {
        return res
            .status(400)
            .json({ error: "Required fields: amount, category_id, date" });
    }

    try {
        const newId = IncomesModel.createIncome({
            name,
            amount,
            category_id,
            subcategory_id,
            date,
            payment_method_id,
        });

        res.status(201).json({ id: newId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteIncome = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "Income ID is required" });
    }

    try {
        const changes = IncomesModel.deleteIncome(id);
        res.json({ changes });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}