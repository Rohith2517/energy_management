// src/components/PredictionChart.js
/*import React from 'react';
import { Bar } from 'react-chartjs-2';

const PredictionChart = ({ predictions, dates }) => {
    const data = {
        labels: dates,
        datasets: [
            {
                label: 'Predicted Solar Production (kW)',
                data: predictions,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return <Bar data={data} options={options} />;
};

export default PredictionChart;*/

// src/components/PredictionChart.js
/*import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

// Register everything to avoid missing scale or plugin errors
Chart.register(...registerables);

const ConsumChart = ({ predictions, dates }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.destroy(); // Prevent duplicate chart creation
        }

        const ctx = document.getElementById('consumChart').getContext('2d');
        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'Consumption for upcoming five days',
                        data: predictions,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'category',
                    },
                    y: {
                        type: 'linear', // Ensure 'linear' scale works properly
                    },
                },
            },
        });

        return () => chartRef.current.destroy(); // Cleanup on component unmount
    }, [predictions, dates]);

    return <canvas id="consumChart" style={{ width: '100%', height: '400px' }}></canvas>;
};

export default ConsumChart;*/

// src/components/PredictionChart.js
import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

// Register everything to avoid missing scale or plugin errors
Chart.register(...registerables);

const ConsumChart = ({ predictions, dates }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.destroy(); // Prevent duplicate chart creation
        }

        const ctx = document.getElementById('consumChart').getContext('2d');
        chartRef.current = new Chart(ctx, {
            type: 'bar', // Change chart type to 'bar'
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'Predicted Energy Consumption (W)',
                        data: predictions,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Bar color
                        borderColor: 'rgba(75, 192, 192, 1)', // Border color
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true,
                    },
                    y: {
                        beginAtZero: true, // Ensure y-axis starts at zero
                    },
                },
            },
        });

        return () => chartRef.current.destroy(); // Cleanup on component unmount
    }, [predictions, dates]);

    return <canvas id="consumChart" style={{ width: '100%', height: '400px' }}></canvas>;
};

export default ConsumChart;

