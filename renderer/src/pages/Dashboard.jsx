import React from 'react';
import MiniBoxData from '../components/MiniBoxData/MiniBoxData';
import StatCard from '../components/StatCard';

const Dashboard = () => {
    return (
        <div className="dashboard-page">
            <header>
                <h1>Dashboard</h1>
            </header>
            <main>
                <section>
                    <article>
                        <StatCard 
                        title="Gastos" 
                        value="500" 
                        interval='Ultimos 30 dias' 
                        trend='down' 
                        data={[699.09, 3722.78, 2758.13, 1800, 1800, 2758.23]} />
                    </article>
                    <article>
                        <StatCard 
                        title="Ingresos" 
                        value="500" 
                        interval='Ultimos 30 dias' 
                        trend='up' 
                        data={[100, 200, 300, 400]} />
                    </article>
                    <article>Balance</article>
                    <article>Grafico categorias</article>
                    <article>Comparativa mes anterior</article>
                    <article>Historial transacciones</article>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;