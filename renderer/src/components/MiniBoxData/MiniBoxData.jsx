import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import './MiniBoxData.css';

const MiniBoxData = ({ title }) => {
    const data = [
        { month: 'Ene', value: 100 },
        { month: 'Feb', value: 200 },
        { month: 'Mar', value: 150 },
        { month: 'Abr', value: 300 },
        { month: 'May', value: 250 },
        { month: 'Jun', value: 400 }
    ];
    return (
        <div className='mini-box-data'>
            <p>{title}</p>
            
            <LineChart
                xAxis={[{ scaleType: 'point', data: data.map(d => d.month) }]}
                series={[{ data: data.map(d => d.value)}]}
                slotProps={{
                    tooltip: { open: false },
                }}
            />


        </div>
    );
}

export default MiniBoxData;