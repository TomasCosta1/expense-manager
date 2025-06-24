const ExpenseModel = require("../models/expensesModel");

exports.getAllExpenses = (req, res) => {
    try {
        const expenses = ExpenseModel.getAllExpenses();
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllAmountExpenses = async (req, res) => {
    try {
        const expenses = await ExpenseModel.getAllExpenses();

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        const filteredExpenses = expenses.filter(e => {
            const date = new Date(e.date);
            return (
                date.getFullYear() === currentYear &&
                date.getMonth() === currentMonth
            );
        });

        const amountsByDate = filteredExpenses.reduce((acc, e) => {
            const dateKey = e.date.split('T')[0];
            if (!acc[dateKey]) acc[dateKey] = 0;
            acc[dateKey] += e.amount;
            return acc;
        }, {});

        const amounts = Object.entries(amountsByDate)
            .sort((a, b) => new Date(a[0]) - new Date(b[0]))
            .map(([_, amount]) => amount);

        res.json(amounts);
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

exports.createExpensesBulk = (req, res) => {
    const expenses = req.body;

    if (!Array.isArray(expenses)) {
        return res.status(400).json({ error: "Expected an array of expenses" });
    }

    try {
        const createdIds = [];

        for (const expense of expenses) {
            const { amount, category_id, date } = expense;

            if (!amount || !category_id || !date) {
                return res.status(400).json({ error: "Each expense must include amount, category_id, and date" });
            }

            const newId = ExpenseModel.createExpense(expense);
            createdIds.push(newId);
        }

        res.status(201).json({ createdIds });
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
