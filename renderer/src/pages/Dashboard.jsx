import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard/StatCard';
import { getAllAmountExpenses, getExpensesByCategory } from '../api/expenses';
import { getAllAmountIncomes } from '../api/incomes'
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import { PieChart } from '@mui/x-charts/PieChart';

const Dashboard = () => {
    const [expensesAmounts, setExpensesAmounts] = useState([]);
    const [incomesAmounts, setIncomesAmounts] = useState([]);
    const [expensesByCategory, setExpensesByCategory] = useState([]);

    useEffect(() => {
        getAllAmountExpenses().then(response => {
            setExpensesAmounts(response.data);
        });
        getAllAmountIncomes().then(response => {
            setIncomesAmounts(response.data);
        });
        getExpensesByCategory().then(response => {
            setExpensesByCategory(response.data);
        });
    }, []);

    function calcularBalance(incomesArray, expensesArray) {
        const totalIncome = incomesArray.reduce((acc, val) => acc + val, 0);

        const days = Math.max(incomesArray.length, expensesArray.length);
        const dailyBalance = [];
        let remaining = 100;

        for (let i = 0; i < days; i++) {
            const gasto = expensesArray[i] || 0;
            const gastoRelativo = (gasto / totalIncome) * 100;
            remaining -= gastoRelativo;
            dailyBalance.push(remaining);
        }

        return dailyBalance;
    }

    // Formatear datos para el PieChart
    const formatCategoryData = (categoryData) => {
        return categoryData.map((item, index) => ({
            id: index,
            value: parseFloat(item.total_amount),
            label: item.category || 'Sin categoría'
        }));
    };

    console.log(expensesAmounts);
    console.log(incomesAmounts)

    return (
        <div className="dashboard-page">
            <header>
                <h1>Dashboard</h1>
            </header>
            <main>
                <section>
                    <Grid
                        container
                        spacing={2}
                        columns={12}
                    >
                        <a href="/expenses">
                            <StatCard
                                title="Gastos"
                                value={`$${expensesAmounts.reduce((acc, amount) => acc + amount, 0).toFixed(2)}`}
                                interval='Ultimos 30 dias'
                                trend='down'
                                data={expensesAmounts}
                            />
                        </a>
                        <a href="/incomes">
                            <StatCard
                                title="Ingresos"
                                value={`$${incomesAmounts.reduce((acc, amount) => acc + amount, 0).toFixed(2)}`}
                                interval='Ultimos 30 dias'
                                trend='up'
                                data={incomesAmounts} />
                        </a>
                        <StatCard
                            title="Balance"
                            value={`$${(incomesAmounts.reduce((acc, amount) => acc + amount, 0) - expensesAmounts.reduce((acc, amount) => acc + amount, 0)).toFixed(2)}`}
                            interval='Ultimos 30 dias'
                            trend='neutral'
                            data={calcularBalance(incomesAmounts, expensesAmounts)}
                        />
                        <Card variant="outlined">
                            <PieChart
                                series={[
                                    {
                                        data: formatCategoryData(expensesByCategory),
                                        highlightScope: { faded: 'global', highlighted: 'item' },
                                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                    },
                                ]}
                                width={400}
                                height={200}
                                slotProps={{
                                    legend: {
                                        direction: 'column',
                                        position: { vertical: 'middle', horizontal: 'right' },
                                        padding: 0,
                                    },
                                }}
                            />
                        </Card>
                        <article>Comparativa mes anterior</article>
                    </Grid>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;