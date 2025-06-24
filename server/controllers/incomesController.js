const IncomesModel = require('../models/incomesModel');

exports.getAllIncomes = (req, res) => {
    try {
        const incomes = IncomesModel.getAllIncomes();
        res.json(incomes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getAllAmountIncomes = async (req, res) => {
    try {
        const incomes = await IncomesModel.getAllIncomes();

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth(); // 0-based

        const filteredIncomes = incomes.filter(e => {
            const [year, month] = e.date.split("-").map(Number);
            return year === currentYear && month - 1 === currentMonth;
        });

        const amountsByDate = filteredIncomes.reduce((acc, e) => {
            const dateKey = e.date;
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
        date,
    } = req.body;

    if (!amount || !date) {
        return res
            .status(400)
            .json({ error: "Required fields: amount, date" });
    }

    try {
        const newId = IncomesModel.createIncome({
            name,
            amount,
            date,
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