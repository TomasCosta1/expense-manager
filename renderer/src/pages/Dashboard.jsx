import React, { useState, useEffect } from 'react';
import MiniBoxData from '../components/MiniBoxData/MiniBoxData';
import StatCard from '../components/StatCard';
import { getAllAmountExpenses } from '../api/expenses';
import { getAllAmountIncomes } from '../api/incomes'
import Grid from '@mui/material/Grid';

const Dashboard = () => {
    const [expensesAmounts, setExpensesAmounts] = useState([]);
    const [incomesAmounts, setIncomesAmounts] = useState([])

    useEffect(() => {
        getAllAmountExpenses().then(response => {
            setExpensesAmounts(response.data);
        });
        getAllAmountIncomes().then(response => {
            setIncomesAmounts(response.data);
        })
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
                                value={`$${expensesAmounts.reduce((acc, amount) => acc + amount, 0)}`}
                                interval='Ultimos 30 dias'
                                trend='down'
                                data={expensesAmounts}
                            />
                        </a>
                        <a href="/incomes">
                        <StatCard
                            title="Ingresos"
                            value={`$${incomesAmounts.reduce((acc, amount) => acc + amount, 0)}`}
                            interval='Ultimos 30 dias'
                            trend='up'
                            data={incomesAmounts} />
                        </a>
                        <StatCard
                            title="Balance"
                            value={`$${incomesAmounts.reduce((acc, amount) => acc + amount, 0) - expensesAmounts.reduce((acc, amount) => acc + amount, 0)}`}
                            interval='Ultimos 30 dias'
                            trend='neutral'
                            data={calcularBalance(incomesAmounts, expensesAmounts)}
                        />
                        <article>Grafico categorias</article>
                        <article>Comparativa mes anterior</article>
                    </Grid>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;