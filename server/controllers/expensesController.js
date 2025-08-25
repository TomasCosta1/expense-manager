const ExpenseModel = require("../models/expensesModel");
const { parseDateLocal } = require("../utils/dateUtils");

exports.getAllExpenses = (req, res) => {
    try {
        const expenses = ExpenseModel.getAllExpenses();
        res.json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getExpensesPaginated = (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 10;
        
        // Extract filters from query parameters
        const filters = {};
        if (req.query.category_id) {
            filters.category_id = parseInt(req.query.category_id);
        }
        if (req.query.subcategory_id) {
            filters.subcategory_id = parseInt(req.query.subcategory_id);
        }
        if (req.query.payment_method_id) {
            filters.payment_method_id = parseInt(req.query.payment_method_id);
        }
        if (req.query.month) {
            filters.month = parseInt(req.query.month);
        }
        if (req.query.year) {
            filters.year = parseInt(req.query.year);
        }
        
        // Extract sort from query parameters
        const sort = {};
        if (req.query.sort_field) {
            sort.field = req.query.sort_field;
            sort.direction = req.query.sort_direction || 'DESC';
        }
        
        const expenses = ExpenseModel.getExpensesPaginated(page, limit, filters, sort);
        const totalCount = ExpenseModel.getTotalExpensesCount(filters);
        
        res.json({
            data: expenses,
            pagination: {
                page: page,
                limit: limit,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllAmountExpenses = async (req, res) => {
    try {
        const expenses = await ExpenseModel.getAllExpenses();

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        const totals = Array(daysInMonth).fill(0);

        expenses.forEach(expense => {
            const { year, month, day } = parseDateLocal(expense.date);

            if (month === currentMonth && year === currentYear) {
                totals[day - 1] += expense.amount;
            }
        });

        return res.json(totals);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener totales por día' });
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

exports.getExpensesByCategory = (req, res) => {
    try {
        const expensesByCategory = ExpenseModel.getExpensesByCategory();
        res.json(expensesByCategory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateExpense = (req, res) => {
    const { id } = req.params;
    const {
        name,
        amount,
        category_id,
        subcategory_id,
        date,
        payment_method_id,
    } = req.body;

    if (!id) {
        return res.status(400).json({ error: "Expense ID is required" });
    }

    if (!amount || !category_id || !date) {
        return res
            .status(400)
            .json({ error: "Required fields: amount, category_id, date" });
    }

    try {
        const changes = ExpenseModel.updateExpense(id, {
            name,
            amount,
            category_id,
            subcategory_id,
            date,
            payment_method_id,
        });
        res.json({ changes });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};
