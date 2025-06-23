const ExpenseModel = require("../models/expensesModel");

exports.getAllExpenses = (req, res) => {
    try {
        const expenses = ExpenseModel.getAllExpenses();
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getExpenseById = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "Expense ID is required" });
    }

    try {
        const expense = ExpenseModel.getExpenseById(id);
        res.json(expense);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

exports.createExpense = (req, res) => {
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
        const newId = ExpenseModel.createExpense({
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

exports.deleteExpense = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "Expense ID is required" });
    }

    try {
        const changes = ExpenseModel.deleteExpense(id);
        res.json({ changes });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};
